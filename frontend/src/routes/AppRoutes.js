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
    <NavigationContainer>
      <Navigator>
        <Screen options={{ headerShown: false }} name="Home" component={Home} />
        <Screen options={{ title: "Jogar" }} name="Client" component={Client} />
        <Screen
          options={{ title: "Iniciar sessão" }}
          name="Server"
          component={Server}
        />
        <Screen
          options={{ title: "Partida", headerLeft: null }}
          name="Match"
          component={Match}
        />
      </Navigator>
    </NavigationContainer>
  );
};
export default AppRoutes;
