import * as fs from 'fs';
import {APISpecifications} from 'lambda-toolkit-utilities';
import '../../example-lambda';

if (APISpecifications.length > 0) {
  fs.writeFileSync(
    './gen.json',
    JSON.stringify(APISpecifications[0].definition, null, 2),
  );
} else {
  console.log('No specifications detected');
}
