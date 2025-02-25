import * as Request from "./request";
import { DataPoint, PredictionPayload } from "./type";
import { flattenNested } from "./utils";

const hostDefault = "https://app.usealbatross.ai/api";

class Client {
  headers: Record<string, string>;
  makeRequest: <A, B extends Record<string, any>>(
    inputs: Request.MakeRequestInputs<B>
  ) => Promise<A>;
  predictionPreProcessing: (data: PredictionPayload) => PredictionPayload;

  constructor(
    public token: string,
    public instanceUuid: string,
    public baseUrl: string = hostDefault,
    options: Partial<{
      makeRequest: <A, B extends Record<string, any>>(
        inputs: Request.MakeRequestInputs<B>
      ) => Promise<A>;
      predictionPreProcessing: (data: PredictionPayload) => PredictionPayload;
    }> = {}
  ) {
    this.headers = {
      "content-type": "application/json",
      Authorization: "Bearer " + this.token,
      "x-instance-id": this.instanceUuid,
    };

    this.makeRequest = options.makeRequest || Request.makeRequest;
    this.predictionPreProcessing =
      options.predictionPreProcessing || ((data) => data);
  }

  async getVersion() {
    const url = this.baseUrl + "/version";
    return this.makeRequest({ url, headers: this.headers });
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

    return this.makeRequest({
      url: this.baseUrl + "/catalog",
      method: "PUT",
      data: { data: formattedData, entity, mainUnit },
      headers: this.headers,
    });
  };

  async putEvent(payload: Event): Promise<any> {
    const url = `${this.baseUrl}/event`;

    return this.makeRequest({
      method: "PUT",
      url: url,
      data: payload,
      headers: this.headers,
    });
  }

  prediction = async (
    payload: PredictionPayload
  ): Promise<{
    ordering: { [key: string]: number };
    datapoint: DataPoint;
    id: string;
  }> => {
    const url = `${this.baseUrl}/use-case/prediction`;

    const data = this.predictionPreProcessing(payload);

    return this.makeRequest({
      method: "POST",
      url,
      data,
      headers: this.headers,
    });
  };

  feedback = async (payload: {
    modelUuid?: string;
    predictionUuid: string;
    value: { [k: string]: any };
  }) => {
    const url = `${this.baseUrl}/feedback`;

    return this.makeRequest({
      method: "POST",
      url: url,
      data: payload,
      headers: this.headers,
    });
  };
}

export default Client;
