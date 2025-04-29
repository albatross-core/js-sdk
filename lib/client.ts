import * as Request from "./request";
import { CatalogAddProps, DataPoint, Event, PredictionPayload } from "./type";
import { bodyToCSV, flattenNested } from "./utils";

export { DataPoint, Event, PredictionPayload };

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
    formatData,
  }: CatalogAddProps) => {
    const formattedData =
      formatData === undefined || formatData === true
        ? data.map(flattenNested)
        : data;

    return this.makeRequest({
      url: this.baseUrl + "/catalog",
      method: "PUT",
      data: { data: formattedData, entity, mainUnit },
      headers: this.headers,
    });
  };

  catalogCSVAdd = async ({
    entity,
    data,
    mainUnit,
  }: CatalogAddProps): Promise<{}> => {
    const queryParams: Record<string, string | undefined> = {
      entity,
      mainUnit,
    };
    const queryParamsString: string = Object.entries(queryParams)
      .filter((entry): entry is [string, string] => !!entry[1])
      .map(([k, v]) => `${k}=${encodeURIComponent(v)}`)
      .join("&");

    const path = "/catalog/csv";
    const url = this.baseUrl + path + "?" + queryParamsString;

    const body: string = bodyToCSV(data);

    const r = await fetch(url, { headers: this.headers, method: "PUT", body });

    return r.json();
  };

  async putEvent(data: Event): Promise<any> {
    const url = `${this.baseUrl}/event`;

    return this.makeRequest({
      method: "PUT",
      url,
      data,
      headers: this.headers,
    });
  }

  async putEventBatch(events: Event[]): Promise<any> {
    const url = `${this.baseUrl}/event/batch`;

    return this.makeRequest({
      method: "PUT",
      url,
      data: { events },
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
