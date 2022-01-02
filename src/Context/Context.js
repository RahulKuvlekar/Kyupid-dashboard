import React, { useState, createContext, useCallback } from "react";

export const Context = createContext({
  processedData: {},
  areaData: {},
  userData: {},
});

const ContextProvider = (props) => {
  const [data, setData] = useState({});
  const [area, setArea] = useState();
  const [user, setUser] = useState();

  const getans = useCallback(
    (id) => {
      if (!id) {
        return;
      }
      let ageSum = 0;
      let isPro = 0;
      let NoOfusers = 0;
      let NoOfMales = 0;
      let NoOfFemales = 0;
      for (let element of user.users) {
        if (id !== element["area_id"]) {
          continue;
        }
        NoOfusers++;
        ageSum += element["age"];
        if (element["is_pro_user"]) {
          isPro += 1;
        }
        if (element["gender"] === "M") {
          NoOfMales += 1;
        }
        if (element["gender"] === "F") {
          NoOfFemales += 1;
        }
      }
      // console.log(isPro, NoOfusers, (isPro / NoOfusers) * 100);
      // console.log("Ans 1", (isPro / NoOfusers) * 100, "%");
      // console.log("Ans 2", NoOfusers);
      // console.log("M/f", NoOfMales, NoOfFemales, NoOfMales / NoOfFemales);
      // console.log("Ans 3", (NoOfMales / NoOfFemales) * 100, "%");

      return {
        ans1: ((isPro / NoOfusers) * 100).toFixed(2),
        ans2: NoOfusers,
        ans3: Math.ceil(NoOfMales / NoOfFemales),
        ans4: Math.floor(ageSum / NoOfusers),
      };
    },
    [user]
  );

  const getQueries = useCallback(() => {
    let ansObject = {};
    let keysObj = {};

    if (area && user && user.users) {
      for (let element of area.features) {
        //console.log("Key ", element.properties.area_id);
        keysObj[element.properties.area_id] = {};
      }

      for (const id in keysObj) {
        const obj = getans(Number(id));

        ansObject[`${Number(id)}`] = obj;
      }

      // console.log(ansObject);
      setData(ansObject);
    }
  }, [area, user, getans]);

  React.useEffect(() => {
    async function fetchData() {
      //fetched Area Data
      const responseArea = await fetch(
        "https://kyupid-api.vercel.app/api/areas"
      );
      const jsonDataArea = await responseArea.json();
      // console.log(jsonDataArea);
      setArea(jsonDataArea);

      //fetched User Data
      const responseUser = await fetch(
        "https://kyupid-api.vercel.app/api/users"
      );
      const jsonDataUser = await responseUser.json();
      setUser(jsonDataUser);
    }
    fetchData();
  }, []);

  React.useEffect(() => {
    getQueries();
  }, [getQueries]);

  const DEFAULT_VALUE = {
    processedData: data,
    areaData: area,
    userData: user,
  };
  return (
    <Context.Provider value={DEFAULT_VALUE}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
