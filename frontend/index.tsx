import { registerRootComponent } from 'expo';
import App from './src/App';

// Register the root component
export default function Main() {
  return <App />;
}

registerRootComponent(Main);
