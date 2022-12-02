import App from '@/app';
import IndexRoute from '@routes/index.route';
import AuthRoute from '@routes/auth.route';
import StressRoute from '@routes/stress.route';
import validateEnv from '@utils/validateEnv';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new StressRoute()]);

app.listen();
