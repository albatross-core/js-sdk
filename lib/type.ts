export interface Event {
  units: Record<string, string>; // unit_uuid: unit_value
  value?: string;
  eventType: string; // uuid
  payload?: Record<string, any>;
  timestamp?: string;
}

export type PredictionUnit = { [k: string]: string };

export interface DataPoint {
  actions: string[];
  context_features: any;
  action_features: any;
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
