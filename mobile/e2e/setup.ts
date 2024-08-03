import detox from 'detox';
import config from '../detox.config';

beforeAll(async () => {
  await detox.init(config, { launchApp: false });
});

afterAll(async () => {
  await detox.cleanup();
});
