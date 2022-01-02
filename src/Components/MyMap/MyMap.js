import React, { useState } from "react";
import "./MyMap.css";
import { MapContainer, GeoJSON, TileLayer } from "react-leaflet";
import useCustomContext from "../../Context/UseCustomContext";

const MyMap = () => {
  const [color, setColor] = useState("blue");
  const [answer, setAnswer] = useState("ans2");
  const { areaData, processedData } = useCustomContext();
  // console.log(" AREA ", areaData, " USER ", userData);
  console.log("processed", Object.keys(processedData).length);

  /* eslint-disable */
  const debounceFunction = (func, delay) => {
    let timer;
    return function (...args) {
      let self = this;
      clearTimeout(timer);
      console.log("cleared", args);
      timer = setTimeout(() => {
        console.log("EXECUTED");
        func.apply(self, args);
      }, delay);
    };
  };

  const updateOpacity = (answer, ans) => {
    let updatedOpacity;

    if (ans === "ans1") {
      // console.log("IN ans1");
      updatedOpacity = answer[ans] / 100;
    } else if (ans === "ans2") {
      // console.log("IN ans2");
      if (answer[ans] >= 0 && answer[ans] <= 50) {
        updatedOpacity = 0.1;
      } else if (answer[ans] >= 51 && answer[ans] <= 100) {
        updatedOpacity = 0.2;
      } else if (answer[ans] >= 101 && answer[ans] <= 150) {
        updatedOpacity = 0.4;
      } else if (answer[ans] >= 151 && answer[ans] <= 200) {
        updatedOpacity = 0.55;
      } else if (answer[ans] >= 201 && answer[ans] <= 250) {
        updatedOpacity = 0.7;
      } else if (answer[ans] >= 251) {
        updatedOpacity = 0.89;
      }
    } else if (ans === "ans3") {
      updatedOpacity = answer[ans] < 10 ? `0.${answer[ans]}` : 0.99999;
    }
    //console.log(updatedOpacity);
    return updatedOpacity;
  };
  const changeOptions = (event, color, answer) => {
    event.stopPropagation();
    setColor(color);
    setAnswer(answer);
  };

  function onEachArea(event, layer, color, ans) {
    let answer = processedData?.[event.properties.area_id];

    let popupPrint = `
    Area Name :-  <span className="value-tag" > ${event.properties.name} </span> <br>
    <br>
    Revenue per area :- <span className="value-tag"> ${answer?.ans1}% </span> <br>
    <br>
    Number of users per area :- <span className="value-tag"> ${answer?.ans2}</span> <br>
    <br>
    Males/Female user Ratio :- <span className="value-tag"> ${answer?.ans3}</span>
    <br>
    <br>
    Average User Age :- <span className="value-tag"> ${answer?.ans4}</span>
    `;
    layer.bindPopup(popupPrint);
    layer.setPopupContent(popupPrint);
    // layer.setStyle({
    //   fillOpacity: updateOpacity(answer, ans),
    // });
    layer.options.fillOpacity = updateOpacity(answer, ans);
    layer.on({
      // mousemove: debounceFunction((e) => {
      //   layer.openPopup();
      //   console.log(e.target);
      //   // e.target.setStyle({
      //   //   fillColor: "green",
      //   //   color: `black`,
      //   //   opacity: `${answer?.ans1}`,
      //   //   weight: "2",
      //   //   dashArray: "0",
      //   // });
      //   // layer.style.fillColor = "blue";
      // }, 1000),
      mousemove: (e) => {
        layer.openPopup();
      },
      mouseout: (e) => {
        if (layer.isPopupOpen()) {
          layer.closePopup();
        }
      },
    });
  }

  //Styles Object
  const leaflet_Container = {
    width: "100%",
    height: "80vh",
    margin: "auto",
  };

  let geoJson_style = {
    fillColor: `${color}`,
    color: `black`,
    weight: "1",
    // opacity: ".7",
    // dashArray: "5",
  };

  return (
    <div>
      <MapContainer
        style={leaflet_Container}
        center={[12.971599, 77.594566]}
        zoom={10}
      >
        <div className="modal-map">
          <h1>Map Data Representation</h1>
          <button onClick={(e) => changeOptions(e, "red", "ans1")}>
            Revenue per area
            <span className="box box-red"></span>
          </button>
          <button onClick={(e) => changeOptions(e, "blue", "ans2")}>
            Number of users per area
            <span className="box box-blue"></span>
          </button>
          <button onClick={(e) => changeOptions(e, "green", "ans3")}>
            Males/Female user Ratio
            <span className="box box-green"></span>
          </button>
        </div>
        {areaData && Object.keys(processedData).length > 0 && (
          <GeoJSON
            style={geoJson_style}
            // className="geoJson_style"
            attribution="&copy; credits RahulKuvlekar."
            data={areaData.features}
            onEachFeature={(event, layer) =>
              onEachArea(event, layer, color, answer)
            }
          />
        )}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
      </MapContainer>
    </div>
  );
};

export default MyMap;
