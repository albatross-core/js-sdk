export interface Event {
  eventType: string; // name (or uuid)
  payload?: Record<string, any>;
  predictionIds?: string[]; // uuids
  predictionId?: string; // prediction uuid
  timestamp?: string; // timestamp can be overriden
  // deprecated
  units?: Record<string, string>; // essentially deprecated
  value?: string; // essentially deprecated
}

export type PredictionUnit = { [k: string]: string };

export interface DataPoint {
  actions: string[];
  context_features: Record<string, string>;
  action_features: Record<string, string>[];
  rewards: any;
  ordering: {
    [k: string]: number;
  };
  scores: {
    [k: string]: number;
  };
  is_randomized: boolean;
  propensities: {
    [k: string]: number;
  };
}

export interface PredictionPayload {
  useCase: { uuid: string };
  context: PredictionUnit;
  actions: PredictionUnit[];
}


export interface CatalogAddProps {
  entity: string;
  data: Record<string, any>[];
  mainUnit?: string;
}