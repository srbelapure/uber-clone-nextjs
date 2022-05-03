import React, { useState } from "react";
import tw from "tailwind-styled-components";

const GeoCoderInput = (props) => {
  const [optionsstate, setOptionsState] = useState({
    results: [],
    loading: false,
    searchTime: new Date(),
    showResults: true,
  });

  const onInput = (e) => {
    setOptionsState({ loading: true });
    var value = e.target.value;
    if (value === "") {
      setOptionsState({
        results: [],
        loading: false,
      });
    } else {
      search(
        "https://api.tiles.mapbox.com",
        "mapbox.places",
        "pk.eyJ1IjoiY29kZXIxOTk0IiwiYSI6ImNrdm12eHhhbzNpODQydm55M3RkYzQ0dnAifQ.4765hgdfnCSdO1LxiOYDdA",
        "",
        "",
        "",
        value,
        onResult()
      );
    }
    setOptionsState({
      showResults: true,
    });
  };

  const search = (
    endpoint,
    source,
    accessToken,
    proximity,
    bbox,
    types,
    query,
    callback
  ) => {
    var searchTime = new Date();
    var uri =
      endpoint +
      "/geocoding/v5/" +
      source +
      "/" +
      encodeURIComponent(query) +
      ".json" +
      "?access_token=" +
      accessToken +
      (proximity ? "&proximity=" + proximity : "") +
      (bbox ? "&bbox=" + bbox : "") +
      (types ? "&types=" + encodeURIComponent(types) : "");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (e) {
      if (xhttp.readyState === 4 && xhttp.status === 200) {
        // console.log("ok, response :", this.response);
        setOptionsState({
          results: JSON.parse(this.response),
        });
      }
    };
    xhttp.open("get", uri, true);
    xhttp.send(),
      function (err, res, body) {
        callback(err, res, body, searchTime);
      };
  };

  const onResult = (err, res, body, searchTime) => {
    // searchTime is compared with the last search to set the state
    // to ensure that a slow xhr response does not scramble the
    // sequence of autocomplete display.
    if (!err && body && body.features && this.state.searchTime <= searchTime) {
      setOptionsState({
        searchTime: searchTime,
        loading: false,
        results: body.features,
        focus: null,
      });
    }
  };

  const onClickMethodForLocation = (selectedLocationName) => {
    props.onClick(selectedLocationName);
    setOptionsState({
      showResults: false,
    });
  };

  return (
    <Wrapper>
      {/* {input} */}
      <InputBoxLocation
        type="text"
        placeholder={props.placeholder}
        value={props.inputValue === "pickup" ? props.pickup : props.dropoff}
        onInput={onInput}
        onChange={props.onChange}
      />

      {optionsstate.results &&
        optionsstate.results.features &&
        optionsstate.results.features.length > 0 && (
          <UnorderedList className={optionsstate.loading ? "loading" : ""}>
            {optionsstate.results.features.map((result, index) => {
              return (
                <UnorderedListSubElement
                  key={result.id}
                  onClick={() => onClickMethodForLocation(result.place_name)}
                >
                  <UnorderedListItem href="#" key={result.id}>
                    {result.place_name}
                  </UnorderedListItem>
                </UnorderedListSubElement>
              );
            })}
          </UnorderedList>
        )}
    </Wrapper>
  );
};

export default GeoCoderInput;

const Wrapper = tw.div`mb-2`;
const InputBoxLocation = tw.input`bg-gray-200 h-10 p-2 w-full outline-none`;
const UnorderedList = tw.ul`bg-gray-200 mt-1`;
const UnorderedListSubElement = tw.li`border-b border-black cursor-pointer hover:bg-gray-300`;
const UnorderedListItem = tw.a``;
