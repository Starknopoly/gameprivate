import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  ContractAddress: { input: any; output: any; }
  Cursor: { input: any; output: any; }
  DateTime: { input: any; output: any; }
  bool: { input: any; output: any; }
  felt252: { input: any; output: any; }
  u64: { input: any; output: any; }
  u128: { input: any; output: any; }
};

export type Component = {
  __typename?: 'Component';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type ComponentConnection = {
  __typename?: 'ComponentConnection';
  edges?: Maybe<Array<Maybe<ComponentEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type ComponentEdge = {
  __typename?: 'ComponentEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Component>;
};

export type ComponentUnion = Eth | Land | Player | Townhall;

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Eth = {
  __typename?: 'ETH';
  balance?: Maybe<Scalars['u128']['output']>;
  entity?: Maybe<Entity>;
  id?: Maybe<Scalars['ContractAddress']['output']>;
};

export type EthConnection = {
  __typename?: 'ETHConnection';
  edges?: Maybe<Array<Maybe<EthEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EthEdge = {
  __typename?: 'ETHEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Eth>;
};

export type EthOrder = {
  direction: Direction;
  field: EthOrderOrderField;
};

export enum EthOrderOrderField {
  Balance = 'BALANCE',
  Id = 'ID'
}

export type EthWhereInput = {
  balance?: InputMaybe<Scalars['String']['input']>;
  balanceGT?: InputMaybe<Scalars['String']['input']>;
  balanceGTE?: InputMaybe<Scalars['String']['input']>;
  balanceLT?: InputMaybe<Scalars['String']['input']>;
  balanceLTE?: InputMaybe<Scalars['String']['input']>;
  balanceNEQ?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  idGT?: InputMaybe<Scalars['String']['input']>;
  idGTE?: InputMaybe<Scalars['String']['input']>;
  idLT?: InputMaybe<Scalars['String']['input']>;
  idLTE?: InputMaybe<Scalars['String']['input']>;
  idNEQ?: InputMaybe<Scalars['String']['input']>;
};

export type Entity = {
  __typename?: 'Entity';
  componentNames?: Maybe<Scalars['String']['output']>;
  components?: Maybe<Array<Maybe<ComponentUnion>>>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  updatedAt?: Maybe<Scalars['DateTime']['output']>;
};

export type EntityConnection = {
  __typename?: 'EntityConnection';
  edges?: Maybe<Array<Maybe<EntityEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EntityEdge = {
  __typename?: 'EntityEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Entity>;
};

export type Event = {
  __typename?: 'Event';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  keys?: Maybe<Scalars['String']['output']>;
  systemCall: SystemCall;
  systemCallId?: Maybe<Scalars['Int']['output']>;
};

export type EventConnection = {
  __typename?: 'EventConnection';
  edges?: Maybe<Array<Maybe<EventEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type EventEdge = {
  __typename?: 'EventEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Event>;
};

export type Land = {
  __typename?: 'Land';
  bomb?: Maybe<Scalars['bool']['output']>;
  bomb_price?: Maybe<Scalars['u64']['output']>;
  bomber?: Maybe<Scalars['ContractAddress']['output']>;
  building_type?: Maybe<Scalars['u64']['output']>;
  entity?: Maybe<Entity>;
  owner?: Maybe<Scalars['ContractAddress']['output']>;
  position?: Maybe<Scalars['u64']['output']>;
  price?: Maybe<Scalars['u64']['output']>;
};

export type LandConnection = {
  __typename?: 'LandConnection';
  edges?: Maybe<Array<Maybe<LandEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type LandEdge = {
  __typename?: 'LandEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Land>;
};

export type LandOrder = {
  direction: Direction;
  field: LandOrderOrderField;
};

export enum LandOrderOrderField {
  Bomb = 'BOMB',
  Bomber = 'BOMBER',
  BombPrice = 'BOMB_PRICE',
  BuildingType = 'BUILDING_TYPE',
  Owner = 'OWNER',
  Position = 'POSITION',
  Price = 'PRICE'
}

export type LandWhereInput = {
  bomb?: InputMaybe<Scalars['Int']['input']>;
  bombGT?: InputMaybe<Scalars['Int']['input']>;
  bombGTE?: InputMaybe<Scalars['Int']['input']>;
  bombLT?: InputMaybe<Scalars['Int']['input']>;
  bombLTE?: InputMaybe<Scalars['Int']['input']>;
  bombNEQ?: InputMaybe<Scalars['Int']['input']>;
  bomb_price?: InputMaybe<Scalars['Int']['input']>;
  bomb_priceGT?: InputMaybe<Scalars['Int']['input']>;
  bomb_priceGTE?: InputMaybe<Scalars['Int']['input']>;
  bomb_priceLT?: InputMaybe<Scalars['Int']['input']>;
  bomb_priceLTE?: InputMaybe<Scalars['Int']['input']>;
  bomb_priceNEQ?: InputMaybe<Scalars['Int']['input']>;
  bomber?: InputMaybe<Scalars['String']['input']>;
  bomberGT?: InputMaybe<Scalars['String']['input']>;
  bomberGTE?: InputMaybe<Scalars['String']['input']>;
  bomberLT?: InputMaybe<Scalars['String']['input']>;
  bomberLTE?: InputMaybe<Scalars['String']['input']>;
  bomberNEQ?: InputMaybe<Scalars['String']['input']>;
  building_type?: InputMaybe<Scalars['Int']['input']>;
  building_typeGT?: InputMaybe<Scalars['Int']['input']>;
  building_typeGTE?: InputMaybe<Scalars['Int']['input']>;
  building_typeLT?: InputMaybe<Scalars['Int']['input']>;
  building_typeLTE?: InputMaybe<Scalars['Int']['input']>;
  building_typeNEQ?: InputMaybe<Scalars['Int']['input']>;
  owner?: InputMaybe<Scalars['String']['input']>;
  ownerGT?: InputMaybe<Scalars['String']['input']>;
  ownerGTE?: InputMaybe<Scalars['String']['input']>;
  ownerLT?: InputMaybe<Scalars['String']['input']>;
  ownerLTE?: InputMaybe<Scalars['String']['input']>;
  ownerNEQ?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  positionGT?: InputMaybe<Scalars['Int']['input']>;
  positionGTE?: InputMaybe<Scalars['Int']['input']>;
  positionLT?: InputMaybe<Scalars['Int']['input']>;
  positionLTE?: InputMaybe<Scalars['Int']['input']>;
  positionNEQ?: InputMaybe<Scalars['Int']['input']>;
  price?: InputMaybe<Scalars['Int']['input']>;
  priceGT?: InputMaybe<Scalars['Int']['input']>;
  priceGTE?: InputMaybe<Scalars['Int']['input']>;
  priceLT?: InputMaybe<Scalars['Int']['input']>;
  priceLTE?: InputMaybe<Scalars['Int']['input']>;
  priceNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type Player = {
  __typename?: 'Player';
  banks?: Maybe<Scalars['u64']['output']>;
  direction?: Maybe<Scalars['u64']['output']>;
  entity?: Maybe<Entity>;
  gold?: Maybe<Scalars['u64']['output']>;
  id?: Maybe<Scalars['ContractAddress']['output']>;
  joined_time?: Maybe<Scalars['u64']['output']>;
  last_point?: Maybe<Scalars['u64']['output']>;
  last_time?: Maybe<Scalars['u64']['output']>;
  nick_name?: Maybe<Scalars['felt252']['output']>;
  position?: Maybe<Scalars['u64']['output']>;
  steps?: Maybe<Scalars['u64']['output']>;
  total_steps?: Maybe<Scalars['u64']['output']>;
  total_used_eth?: Maybe<Scalars['u128']['output']>;
};

export type PlayerConnection = {
  __typename?: 'PlayerConnection';
  edges?: Maybe<Array<Maybe<PlayerEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type PlayerEdge = {
  __typename?: 'PlayerEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Player>;
};

export type PlayerOrder = {
  direction: Direction;
  field: PlayerOrderOrderField;
};

export enum PlayerOrderOrderField {
  Banks = 'BANKS',
  Direction = 'DIRECTION',
  Gold = 'GOLD',
  Id = 'ID',
  JoinedTime = 'JOINED_TIME',
  LastPoint = 'LAST_POINT',
  LastTime = 'LAST_TIME',
  NickName = 'NICK_NAME',
  Position = 'POSITION',
  Steps = 'STEPS',
  TotalSteps = 'TOTAL_STEPS',
  TotalUsedEth = 'TOTAL_USED_ETH'
}

export type PlayerWhereInput = {
  banks?: InputMaybe<Scalars['Int']['input']>;
  banksGT?: InputMaybe<Scalars['Int']['input']>;
  banksGTE?: InputMaybe<Scalars['Int']['input']>;
  banksLT?: InputMaybe<Scalars['Int']['input']>;
  banksLTE?: InputMaybe<Scalars['Int']['input']>;
  banksNEQ?: InputMaybe<Scalars['Int']['input']>;
  direction?: InputMaybe<Scalars['Int']['input']>;
  directionGT?: InputMaybe<Scalars['Int']['input']>;
  directionGTE?: InputMaybe<Scalars['Int']['input']>;
  directionLT?: InputMaybe<Scalars['Int']['input']>;
  directionLTE?: InputMaybe<Scalars['Int']['input']>;
  directionNEQ?: InputMaybe<Scalars['Int']['input']>;
  gold?: InputMaybe<Scalars['Int']['input']>;
  goldGT?: InputMaybe<Scalars['Int']['input']>;
  goldGTE?: InputMaybe<Scalars['Int']['input']>;
  goldLT?: InputMaybe<Scalars['Int']['input']>;
  goldLTE?: InputMaybe<Scalars['Int']['input']>;
  goldNEQ?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  idGT?: InputMaybe<Scalars['String']['input']>;
  idGTE?: InputMaybe<Scalars['String']['input']>;
  idLT?: InputMaybe<Scalars['String']['input']>;
  idLTE?: InputMaybe<Scalars['String']['input']>;
  idNEQ?: InputMaybe<Scalars['String']['input']>;
  joined_time?: InputMaybe<Scalars['Int']['input']>;
  joined_timeGT?: InputMaybe<Scalars['Int']['input']>;
  joined_timeGTE?: InputMaybe<Scalars['Int']['input']>;
  joined_timeLT?: InputMaybe<Scalars['Int']['input']>;
  joined_timeLTE?: InputMaybe<Scalars['Int']['input']>;
  joined_timeNEQ?: InputMaybe<Scalars['Int']['input']>;
  last_point?: InputMaybe<Scalars['Int']['input']>;
  last_pointGT?: InputMaybe<Scalars['Int']['input']>;
  last_pointGTE?: InputMaybe<Scalars['Int']['input']>;
  last_pointLT?: InputMaybe<Scalars['Int']['input']>;
  last_pointLTE?: InputMaybe<Scalars['Int']['input']>;
  last_pointNEQ?: InputMaybe<Scalars['Int']['input']>;
  last_time?: InputMaybe<Scalars['Int']['input']>;
  last_timeGT?: InputMaybe<Scalars['Int']['input']>;
  last_timeGTE?: InputMaybe<Scalars['Int']['input']>;
  last_timeLT?: InputMaybe<Scalars['Int']['input']>;
  last_timeLTE?: InputMaybe<Scalars['Int']['input']>;
  last_timeNEQ?: InputMaybe<Scalars['Int']['input']>;
  nick_name?: InputMaybe<Scalars['String']['input']>;
  nick_nameGT?: InputMaybe<Scalars['String']['input']>;
  nick_nameGTE?: InputMaybe<Scalars['String']['input']>;
  nick_nameLT?: InputMaybe<Scalars['String']['input']>;
  nick_nameLTE?: InputMaybe<Scalars['String']['input']>;
  nick_nameNEQ?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  positionGT?: InputMaybe<Scalars['Int']['input']>;
  positionGTE?: InputMaybe<Scalars['Int']['input']>;
  positionLT?: InputMaybe<Scalars['Int']['input']>;
  positionLTE?: InputMaybe<Scalars['Int']['input']>;
  positionNEQ?: InputMaybe<Scalars['Int']['input']>;
  steps?: InputMaybe<Scalars['Int']['input']>;
  stepsGT?: InputMaybe<Scalars['Int']['input']>;
  stepsGTE?: InputMaybe<Scalars['Int']['input']>;
  stepsLT?: InputMaybe<Scalars['Int']['input']>;
  stepsLTE?: InputMaybe<Scalars['Int']['input']>;
  stepsNEQ?: InputMaybe<Scalars['Int']['input']>;
  total_steps?: InputMaybe<Scalars['Int']['input']>;
  total_stepsGT?: InputMaybe<Scalars['Int']['input']>;
  total_stepsGTE?: InputMaybe<Scalars['Int']['input']>;
  total_stepsLT?: InputMaybe<Scalars['Int']['input']>;
  total_stepsLTE?: InputMaybe<Scalars['Int']['input']>;
  total_stepsNEQ?: InputMaybe<Scalars['Int']['input']>;
  total_used_eth?: InputMaybe<Scalars['String']['input']>;
  total_used_ethGT?: InputMaybe<Scalars['String']['input']>;
  total_used_ethGTE?: InputMaybe<Scalars['String']['input']>;
  total_used_ethLT?: InputMaybe<Scalars['String']['input']>;
  total_used_ethLTE?: InputMaybe<Scalars['String']['input']>;
  total_used_ethNEQ?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  component: Component;
  components?: Maybe<ComponentConnection>;
  entities?: Maybe<EntityConnection>;
  entity: Entity;
  ethComponents?: Maybe<EthConnection>;
  event: Event;
  events?: Maybe<EventConnection>;
  landComponents?: Maybe<LandConnection>;
  playerComponents?: Maybe<PlayerConnection>;
  system: System;
  systemCall: SystemCall;
  systemCalls?: Maybe<SystemCallConnection>;
  systems?: Maybe<SystemConnection>;
  townhallComponents?: Maybe<TownhallConnection>;
};


export type QueryComponentArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEntitiesArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  keys?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  last?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryEntityArgs = {
  id: Scalars['ID']['input'];
};


export type QueryEthComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<EthOrder>;
  where?: InputMaybe<EthWhereInput>;
};


export type QueryEventArgs = {
  id: Scalars['ID']['input'];
};


export type QueryLandComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<LandOrder>;
  where?: InputMaybe<LandWhereInput>;
};


export type QueryPlayerComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<PlayerOrder>;
  where?: InputMaybe<PlayerWhereInput>;
};


export type QuerySystemArgs = {
  id: Scalars['ID']['input'];
};


export type QuerySystemCallArgs = {
  id: Scalars['Int']['input'];
};


export type QueryTownhallComponentsArgs = {
  after?: InputMaybe<Scalars['Cursor']['input']>;
  before?: InputMaybe<Scalars['Cursor']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
  last?: InputMaybe<Scalars['Int']['input']>;
  order?: InputMaybe<TownhallOrder>;
  where?: InputMaybe<TownhallWhereInput>;
};

export type Subscription = {
  __typename?: 'Subscription';
  componentRegistered: Component;
  entityUpdated: Entity;
};

export type System = {
  __typename?: 'System';
  classHash?: Maybe<Scalars['felt252']['output']>;
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  systemCalls: Array<SystemCall>;
  transactionHash?: Maybe<Scalars['felt252']['output']>;
};

export type SystemCall = {
  __typename?: 'SystemCall';
  createdAt?: Maybe<Scalars['DateTime']['output']>;
  data?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  system: System;
  systemId?: Maybe<Scalars['ID']['output']>;
  transactionHash?: Maybe<Scalars['String']['output']>;
};

export type SystemCallConnection = {
  __typename?: 'SystemCallConnection';
  edges?: Maybe<Array<Maybe<SystemCallEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemCallEdge = {
  __typename?: 'SystemCallEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<SystemCall>;
};

export type SystemConnection = {
  __typename?: 'SystemConnection';
  edges?: Maybe<Array<Maybe<SystemEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type SystemEdge = {
  __typename?: 'SystemEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<System>;
};

export type Townhall = {
  __typename?: 'Townhall';
  entity?: Maybe<Entity>;
  gold?: Maybe<Scalars['u64']['output']>;
  id?: Maybe<Scalars['u64']['output']>;
};

export type TownhallConnection = {
  __typename?: 'TownhallConnection';
  edges?: Maybe<Array<Maybe<TownhallEdge>>>;
  totalCount: Scalars['Int']['output'];
};

export type TownhallEdge = {
  __typename?: 'TownhallEdge';
  cursor: Scalars['Cursor']['output'];
  node?: Maybe<Townhall>;
};

export type TownhallOrder = {
  direction: Direction;
  field: TownhallOrderOrderField;
};

export enum TownhallOrderOrderField {
  Gold = 'GOLD',
  Id = 'ID'
}

export type TownhallWhereInput = {
  gold?: InputMaybe<Scalars['Int']['input']>;
  goldGT?: InputMaybe<Scalars['Int']['input']>;
  goldGTE?: InputMaybe<Scalars['Int']['input']>;
  goldLT?: InputMaybe<Scalars['Int']['input']>;
  goldLTE?: InputMaybe<Scalars['Int']['input']>;
  goldNEQ?: InputMaybe<Scalars['Int']['input']>;
  id?: InputMaybe<Scalars['Int']['input']>;
  idGT?: InputMaybe<Scalars['Int']['input']>;
  idGTE?: InputMaybe<Scalars['Int']['input']>;
  idLT?: InputMaybe<Scalars['Int']['input']>;
  idLTE?: InputMaybe<Scalars['Int']['input']>;
  idNEQ?: InputMaybe<Scalars['Int']['input']>;
};

export type GetAllPlayersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllPlayersQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'ETH', balance?: any | null } | { __typename: 'Land' } | { __typename: 'Player', nick_name?: any | null, joined_time?: any | null, direction?: any | null, gold?: any | null, position?: any | null, steps?: any | null, last_point?: any | null, last_time?: any | null, total_steps?: any | null, banks?: any | null, total_used_eth?: any | null } | { __typename: 'Townhall' } | null> | null } | null } | null> | null } | null };

export type GetPlayerByKeyQueryVariables = Exact<{
  key?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetPlayerByKeyQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'ETH', balance?: any | null } | { __typename: 'Land' } | { __typename: 'Player', nick_name?: any | null, joined_time?: any | null, direction?: any | null, gold?: any | null, position?: any | null, steps?: any | null, last_point?: any | null, last_time?: any | null, total_steps?: any | null, banks?: any | null, total_used_eth?: any | null } | { __typename: 'Townhall' } | null> | null } | null } | null> | null } | null };

export type GetAllBuildingsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllBuildingsQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', totalCount: number, edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'ETH' } | { __typename: 'Land', position?: any | null, owner?: any | null, building_type?: any | null, price?: any | null, bomb?: any | null, bomber?: any | null, bomb_price?: any | null } | { __typename: 'Player' } | { __typename: 'Townhall' } | null> | null } | null } | null> | null } | null };

export type GetBuildingByKeyQueryVariables = Exact<{
  key?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetBuildingByKeyQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'ETH' } | { __typename: 'Land', position?: any | null, owner?: any | null, building_type?: any | null, price?: any | null, bomb?: any | null, bomber?: any | null, bomb_price?: any | null } | { __typename: 'Player' } | { __typename: 'Townhall' } | null> | null } | null } | null> | null } | null };

export type GetEthByKeyQueryVariables = Exact<{
  key?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetEthByKeyQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'ETH', balance?: any | null } | { __typename: 'Land' } | { __typename: 'Player' } | { __typename: 'Townhall' } | null> | null } | null } | null> | null } | null };

export type GetTownHallBalanceQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTownHallBalanceQuery = { __typename?: 'Query', entities?: { __typename?: 'EntityConnection', edges?: Array<{ __typename?: 'EntityEdge', node?: { __typename?: 'Entity', keys?: Array<string | null> | null, components?: Array<{ __typename: 'ETH' } | { __typename: 'Land' } | { __typename: 'Player' } | { __typename: 'Townhall', gold?: any | null } | null> | null } | null } | null> | null } | null };


export const GetAllPlayersDocument = gql`
    query getAllPlayers {
  entities(first: 1000, keys: ["%"]) {
    totalCount
    edges {
      node {
        keys
        components {
          __typename
          ... on Player {
            nick_name
            joined_time
            direction
            gold
            position
            steps
            last_point
            last_time
            total_steps
            banks
            total_used_eth
          }
          __typename
          ... on ETH {
            balance
          }
        }
      }
    }
  }
}
    `;
export const GetPlayerByKeyDocument = gql`
    query getPlayerByKey($key: String) {
  entities(first: 1000, keys: [$key]) {
    totalCount
    edges {
      node {
        keys
        components {
          __typename
          ... on Player {
            nick_name
            joined_time
            direction
            gold
            position
            steps
            last_point
            last_time
            total_steps
            banks
            total_used_eth
          }
          __typename
          ... on ETH {
            balance
          }
        }
      }
    }
  }
}
    `;
export const GetAllBuildingsDocument = gql`
    query getAllBuildings {
  entities(first: 1000, keys: ["%"]) {
    totalCount
    edges {
      node {
        keys
        components {
          __typename
          ... on Land {
            position
            owner
            building_type
            price
            bomb
            bomber
            bomb_price
          }
        }
      }
    }
  }
}
    `;
export const GetBuildingByKeyDocument = gql`
    query getBuildingByKey($key: String) {
  entities(first: 1000, keys: [$key]) {
    edges {
      node {
        keys
        components {
          __typename
          ... on Land {
            position
            owner
            building_type
            price
            bomb
            bomber
            bomb_price
          }
        }
      }
    }
  }
}
    `;
export const GetEthByKeyDocument = gql`
    query getETHByKey($key: String) {
  entities(first: 1000, keys: [$key]) {
    edges {
      node {
        keys
        components {
          __typename
          ... on ETH {
            balance
          }
        }
      }
    }
  }
}
    `;
export const GetTownHallBalanceDocument = gql`
    query getTownHallBalance {
  entities(first: 1000, keys: ["0x1"]) {
    edges {
      node {
        keys
        components {
          __typename
          ... on Townhall {
            gold
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetAllPlayersDocumentString = print(GetAllPlayersDocument);
const GetPlayerByKeyDocumentString = print(GetPlayerByKeyDocument);
const GetAllBuildingsDocumentString = print(GetAllBuildingsDocument);
const GetBuildingByKeyDocumentString = print(GetBuildingByKeyDocument);
const GetEthByKeyDocumentString = print(GetEthByKeyDocument);
const GetTownHallBalanceDocumentString = print(GetTownHallBalanceDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getAllPlayers(variables?: GetAllPlayersQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetAllPlayersQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetAllPlayersQuery>(GetAllPlayersDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllPlayers', 'query');
    },
    getPlayerByKey(variables?: GetPlayerByKeyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetPlayerByKeyQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetPlayerByKeyQuery>(GetPlayerByKeyDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getPlayerByKey', 'query');
    },
    getAllBuildings(variables?: GetAllBuildingsQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetAllBuildingsQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetAllBuildingsQuery>(GetAllBuildingsDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllBuildings', 'query');
    },
    getBuildingByKey(variables?: GetBuildingByKeyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetBuildingByKeyQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetBuildingByKeyQuery>(GetBuildingByKeyDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getBuildingByKey', 'query');
    },
    getETHByKey(variables?: GetEthByKeyQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetEthByKeyQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetEthByKeyQuery>(GetEthByKeyDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getETHByKey', 'query');
    },
    getTownHallBalance(variables?: GetTownHallBalanceQueryVariables, requestHeaders?: GraphQLClientRequestHeaders): Promise<{ data: GetTownHallBalanceQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetTownHallBalanceQuery>(GetTownHallBalanceDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getTownHallBalance', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;