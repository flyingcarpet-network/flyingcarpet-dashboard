/*
 * This file is used to define all enums used by Redux
 */

/* Bounty filter types */
export enum BountyFilter {
  ALL,
  INACTIVE,
  ACTIVE,
  COMPLETE
};

/* Transaction processing states */
export enum TxnStates {
  DEFAULT, // No transaction currently - empty
  SUBMITTED,
  PENDING,
  COMPLETE,
  FAILED
};

