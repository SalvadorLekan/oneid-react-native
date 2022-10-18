# The React Native SDK for Oneid Tech

## Installation
  install the package via npm:
  ```bash
  npm install oneid-react-native --save
  ```
  or yarn:
  ```bash
  yarn add oneid-react-native
  ```
  then link the package (for react-native < 0.60):
  ```bash
  react-native link oneid-react-native
  ```
## Usage:

    ```javascript
    import { OneidProvider } from 'oneid-react-native';

    const App = () => {
      return (
        <OneidProvider
          apiKey='YOUR_API_KEY'
        >
          <YourApp />
        </OneidProvider>
      );
    };
    ```


    ```javascript
    import { useOneid } from 'oneid-react-native';

    const YourApp = () => {
      const { login } = useOneid();

      const handleLogin = async () => {
        try {
          const user = await login();
          console.log(user);
        } catch (error) {
          console.log(error);
        }
      };

      return (
        <View>
          <Button title='Login' onPress={handleLogin} />
        </View>
      );
    };
    ```
