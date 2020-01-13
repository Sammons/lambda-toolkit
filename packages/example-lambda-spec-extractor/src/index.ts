import * as fs from 'fs';
import '../../example-lambda';

import {APISpecifications} from '../../lambda-toolkit-utilities';
fs.writeFileSync(
  './gen.json',
  JSON.stringify(APISpecifications[0].definition, null, 2),
);
