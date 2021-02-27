import React, { useState, useEffect } from 'react'
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
} = require("react-google-maps");
const { StandaloneSearchBox } = require("react-google-maps/lib/components/places/StandaloneSearchBox");

const PlacesWithStandaloneSearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZXyEzKc1WXdZeXh9zyWCiRJQDEJXOfPo&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      this.setState({
        places: [],
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          this.setState({
            places,
          });
        },
      })
    },
  }),
  withScriptjs  
)(props => {
    useEffect(()=>{
        props.onChange.onAddressChange(props.places);
    },[props.places]);
    return(
        <div data-standalone-searchbox="">
            <StandaloneSearchBox
                ref={props.onSearchBoxMounted}
                bounds={props.bounds}
                onPlacesChanged={props.onPlacesChanged}
            >
            <input
                type="text"
                placeholder="ادخل عنوان للبحث عنه"
                style={{
                boxSizing: `border-box`,
                border: `1px solid transparent`,
                width: `100%`,
                height: `45px`,
                marginTop: `8px`,
                marginRight: `8px`,
                padding: `8px 15px`,
                borderRadius: `3px`,
                boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                fontSize: `15px`,
                fontFamily: `Cairo`,
                outline: `none`,
                textOverflow: `ellipses`,
                }}
            />
        </StandaloneSearchBox>
    </div>
)});

const Index = ( onAddressChange ) => {
    console.log('onAddressChange', onAddressChange);
    return (
        <PlacesWithStandaloneSearchBox onChange={onAddressChange} />
    )
}

export default Index
