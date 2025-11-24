import { Amplify } from "aws-amplify";
import amplifyConfig from './amplifyconfiguration.json';

Amplify.configure(amplifyConfig);

export default Amplify;