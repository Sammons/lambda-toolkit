import { Dynamoify, UnDynamoify } from './dynamo-converter';
import { DynamoDB } from 'aws-sdk'
export class DynamoSlim {
  constructor(private table: string, private dynamo: DynamoDB) { }
  // TODO: handle capacity exception
  private async batchWrite<T>(table: string, items: Array<T>) {
    while (items.length > 0) {
      const nextChunk = items.splice(0, 20);
      let unprocessedItems = await this.dynamo.batchWriteItem({
        RequestItems: {
          [table]: nextChunk.map(item => {
            return {
              PutRequest: {
                Item: Array.isArray(item) ? Dynamoify(item) : Dynamoify<{}>(item)['M']
              }
            };
          }) as any[]
        }
      }).promise();
      while (unprocessedItems && unprocessedItems.UnprocessedItems
        && unprocessedItems.UnprocessedItems[table]
        // TODO verify this is correct
        && unprocessedItems.UnprocessedItems[table].length > 0) {
        unprocessedItems = await this.dynamo.batchWriteItem({
          RequestItems: unprocessedItems.UnprocessedItems
        }).promise();
      }
    }
  }
  async save<T>(item: T | Array<T>): Promise<void> {
    if (Array.isArray(item)) {
      await this.batchWrite(this.table, item);
    } else {
      await this.dynamo.putItem({
        TableName: this.table,
        Item: item as { [key: string]: any }
      }).promise();
    }
  }
  async delete(keys: { [key: string]: any }): Promise<void> {
    await this.dynamo.deleteItem({
      TableName: this.table,
      Key: keys
    }).promise();
  }
  async get(keys: { [key: string]: any }): Promise<{ [key: string]: any } | undefined> {
    const res = await this.dynamo.getItem({
      TableName: this.table,
      Key: keys
    }).promise();
    return UnDynamoify(res.Item);
  }
  private static descriptions = {} as { [key: string]: any };
  private async getDescription(): Promise<{ KeySchema: { AttributeName: string; }[]; GlobalSecondaryIndexes: { IndexName: string; KeySchema: { AttributeName: string }[] }[] }> {
    if (DynamoSlim.descriptions[this.table] == null) {
      DynamoSlim.descriptions[this.table] = await this.dynamo.describeTable({
        TableName: this.table
      }).promise();
    }
    return DynamoSlim.descriptions[this.table].Table;
  }
  async getAll(keys: { [key: string]: { op: string, value: any } }): Promise<{ [key: string]: any }[] | undefined> {
    const description = await this.getDescription();
    const gsiColumns: string[] = description.GlobalSecondaryIndexes?.map(i => i.KeySchema?.map(ks => ks.AttributeName)).filter(Boolean).reduce((a, b) => (b || []).concat(a || []), []) ?? [];
    const keyColumns: string[] = description.KeySchema?.map(k => k.AttributeName) ?? [];
    const identifyIndex = (key?: string) => {
      const idx = description.GlobalSecondaryIndexes?.find(i => i.KeySchema?.find(ks => ks.AttributeName === key));
      if (idx) {
        return idx.IndexName;
      }
      return undefined;
    };
    const searchKeys = Object.keys(keys);
    let indexName = identifyIndex(searchKeys.find(k => gsiColumns.includes(k)));
    const keySearchKeys = searchKeys.filter(k => gsiColumns.includes(k) || keyColumns.includes(k));
    const filterKeys = searchKeys.filter(k => !gsiColumns.includes(k) && !keyColumns.includes(k));
    const names = {} as { [key: string]: any };
    const values = {} as { [key: string]: any; };
    let counter = 0;
    const generateExpression = (inputKeys: string[]) => {
      let expression: string | undefined = undefined;
      inputKeys.forEach(key => {
        counter++;
        if (expression === undefined) {
          expression = `#k${counter} ${keys[key].op} :${key}`;
        } else {
          expression += ` and #k${counter} ${keys[key].op} :${key}`;
        }
        names[`#k${counter}`] = key;
        values[`:${key}`] = Dynamoify(keys[key].value);
      });
      return { expression };
    };
    const {
      expression: keyConditionExpression
    } = generateExpression(keySearchKeys);
    const {
      expression: filterConditionExpression,
    } = generateExpression(filterKeys);
    if (keySearchKeys.length > 0) {
      const res = await this.dynamo.query({
        TableName: this.table,
        KeyConditionExpression: keyConditionExpression,
        ExpressionAttributeValues: values,
        ExpressionAttributeNames: names,
        FilterExpression: filterConditionExpression,
        IndexName: indexName
      }).promise();
      return res.Items?.map(UnDynamoify);
    } else {
      const res = await this.dynamo.scan({
        TableName: this.table,
        FilterExpression: filterConditionExpression,
        ExpressionAttributeNames: names,
        ExpressionAttributeValues: values
      }).promise();
      return res.Items?.map(UnDynamoify);
    }
  }
}