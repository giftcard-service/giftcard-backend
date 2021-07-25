import {
  Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
} from '@casl/ability';

import { Action } from './constants';
import { Giftcard } from '../giftcards/giftcard.entity';
import { Store } from '../stores/store.entity';
import { User } from '../users/user.entity';
import { Injectable } from '@nestjs/common';
import { GiftcardPurchase } from '../giftcard-purchases/giftcard-purchase.entity';
import { QrCode } from '../qrcodes/qrcode.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

type Subjects =
  | InferSubjects<
      | typeof Giftcard
      | typeof GiftcardPurchase
      | typeof QrCode
      | typeof Store
      | typeof User
    >
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

@Injectable()
export class CaslAbilityFactory {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async createForUser(reqUser: { userId: string }) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[Action, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const userInfo = await this.usersRepository.findOne(reqUser.userId);
    const user = userInfo;

    if (userInfo.isManager) {
      can(Action.Manage, 'all'); // read-write access to everything
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Read, User, { id: user.id });
    can(Action.Update, User, { id: user.id });
    cannot(Action.Delete, User, {});

    can(Action.Read, Giftcard, { owner: { id: user.id } });
    can(Action.Update, Giftcard, { store: user.store });

    can(Action.Create, GiftcardPurchase, { giftcard: { owner: user } });

    can(Action.Create, QrCode, { giftcard: { owner: user } });

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
