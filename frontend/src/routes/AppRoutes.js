import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "../screens/Home";
import Client from "../screens/Client";
import Server from "../screens/Server";
import Match from "../screens/Match";


const { Navigator, Screen } = createStackNavigator();

const AppRoutes = () => {
  return (
    <>
      <NavigationContainer>
        <Navigator>
          <Screen name="Home" component={Home} />
          <Screen name="Client" component={Client} />
          <Screen name="Server" component={Server} />
          <Screen name="Match" component={Match} />
        </Navigator>
      </NavigationContainer>
    </>
  );
};
export default AppRoutes;
