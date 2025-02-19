import { flattenNested } from "./utils";

const hostDefault = "https://app.usealbatross.ai/api";

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

class Client {
  headers: Record<string, string>;
  constructor(
    public token: string,
    public instanceUuid: string,
    public baseUrl: string = hostDefault
  ) {
    this.headers = {
      "content-type": "application/json",
      Authorization: "Bearer " + this.token,
      "x-instance-id": this.instanceUuid,
    };
  }

  async getVersion() {
    const response = await fetch(this.baseUrl + "/version");
    return response.json();
  }

  private async handleNotOk(response: Response) {
    if (!response.ok) {
      throw new Error(
        `Request failed: ${response.status} ${
          response.statusText
        } ${await response.text()}`
      );
    }
  }

  catalogAdd = async ({
    entity,
    data,
    mainUnit,
  }: {
    entity: string;
    data: { [k: string]: any }[];
    mainUnit?: string;
  }) => {
    const formattedData = data.map(flattenNested);
    const response = await fetch(this.baseUrl + "/catalog", {
      method: "PUT",
      body: JSON.stringify({ data: formattedData, entity, mainUnit }),
      headers: this.headers,
    });

    await this.handleNotOk(response);

    return response.json();
  };

  async putEvent(payload: Event): Promise<any> {
    const url = `${this.baseUrl}/event`;

    const response = await fetch(url, {
      method: "PUT",
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    await this.handleNotOk(response);

    return response.json();
  }

  prediction = async (payload: {
    useCase: { uuid: string };
    context: PredictionUnit;
    actions: PredictionUnit[];
  }): Promise<{
    ordering: { [key: string]: number };
    datapoint: DataPoint;
    id: string;
  }> => {
    const url = `${this.baseUrl}/use-case/prediction`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    await this.handleNotOk(response);

    return response.json();
  };

  feedback = async (payload: {
    modelUuid?: string;
    predictionUuid: string;
    value: { [k: string]: any };
  }) => {
    const url = `${this.baseUrl}/feedback`;

    const response = await fetch(url, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    await this.handleNotOk(response);

    return response.json();
  };
}

export default Client;
