import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import Container from '../../Container'
import Layout from '../../../src/layouts'
import Widget from '../../../src/components/widget'
import { Alert } from '../../../src/components/alerts'
import Select from 'react-select'
import Api from '../../../src/api'
import * as Icon from 'react-feather'
import { NotificationManager } from 'react-notifications'
import { useRouter } from 'next/router'
import LoadingModal from '../../../src/components/modals/LoadingModal'
import Modal from '../../../src/components/modals'
import ImageSelector from "./imageSelector"

import { compose, withProps, lifecycle } from "recompose"
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const MapComponent = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyDZXyEzKc1WXdZeXh9zyWCiRJQDEJXOfPo&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}
      this.setState({
        coords: null,
        updated: false,
        onMapMounted: ref => {
          refs.map = ref;
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();
          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          refs.map.fitBounds(bounds);
          this.setState({
            address: places[0].formatted_address,
            coords: {
              latitude: places[0].geometry.location.lat(),
              longitude: places[0].geometry.location.lng(),
            },
            zoom: 16
          });
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => {
  useEffect(()=>{
    if(props.coords){
      if(props.coords.latitude !== props.latitude || props.coords.longitude !== props.longitude){
        props.onSelectPlace(props.address, props.coords);
      }
    }
  }, [props.coords]);
  return (
  <GoogleMap
    defaultZoom={props.zoom ? props.zoom : 16}
    ref={props.onMapMounted}
    defaultCenter={{ lat: props.latitude, lng: props.longitude }}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_RIGHT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="ادخل عنوان للبحث عنه"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `500px`,
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
    </SearchBox>
    <Marker
      position={{ lat: props.latitude, lng: props.longitude }}
      defaultDraggable={true}
      onDragEnd={props.onMarkerDragEnd}
    />
  </GoogleMap>
)});

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [confirmModal, setConfirmModal] = useState(false)
  const [modal, setModal] = useState(false)
  const [updated, setUpdated] = useState(false);
  const [branches, setBranches] = useState(['1'])
  const [providerID, setProviderID] = useState(null)
  const [branchData, setBranchData] = useState(null)
  const [cityID, setCityID] = useState({label:'', value:null})
  const [categoryID, setCategoryID] = useState({label:'', value:null})
  const [subCategoryID, setSubCategoryID] = useState({label:'', value:null})
  
  const [selectedProvider, setSelectedProvider] = useState()
  const [selectedCity, setSelectedCity] = useState()
  const [selectedCat, setSelectedCat] = useState()
  const [selectedSubCat, setSelectedSubCat] = useState()
  
  const [citiesList, setCitiesList] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [imagesList, setImagesList] = useState([])
  const [defaultImagesList, setDefaultImagesList] = useState([])
  const [imagesIDsToRemove, setImagesIDsToRemove] = useState([])
  const [subCategories, setSubCategories] = useState([])
  const [subCategoriesList, setSubCategoriesList] = useState([])
  const [alertType, setAlertType] = useState('red');
  const [address, setAddress] = useState('')
  const [providerType, setProviderType] = useState({label:'مقدم خدمة مسجل مسبقا',value:'Registered'})
  const [providersList, setProvidersList] = useState([{label:'مقدم خدمة تجريبي',value:"1"}])
  const [providerTypeOpts, setProviderTypeOpts] = useState([{label:'-- إختر نوع مقدم الخدمة --',value:"null"},{label:'مقدم خدمة مسجل مسبقا',value:'Registered'},{label:'مقدم خدمة جديد',value:'New'}]);
  const [latitude, setLatitude] = useState(24.7249316);
  const [longitude, setLongitude] = useState(46.5423435);
  const [toDeleteID, setToDeleteID] = useState(null);
  const {register, handleSubmit, watch, errors, setValue, reset} = useForm({defaultValues: { branch_name: "", branch_desc: "", whats: "", twitter: "", facebook: "", snapchat: "", insta: "", telephone: 0, city_id: 0, category_id: 0, email: "", lat: 0, lon: 0, sub_cat_id: 0, provider_id: 0 }});
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id){
      _getBrancheDetails(id);
    }else{
      setLoadingData(false);
      setBranchData(null);
      setMessages("عفوا : رقم الفرع غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم الفرع غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _removeBranchImage = ( image_id ) => {
    setConfirmModal(true);
    setToDeleteID(image_id);
  }

  const _confirmRemoveBranchImage = () => {
    setConfirmModal(false);
    var data = {branch: id, image: toDeleteID};
    Api.Branches.deleteImage(data).then((res)=>{
      if(res.statusCode === 201){
        NotificationManager.success('تم حذف الصورة بنجاح', 'نجاح', 3000);
        let newListimgs = [];
        let curImages = defaultImagesList;
        for (let index = 0; index < curImages.length; index++) {
          const imGent = curImages[index];
          if(imGent.id !== toDeleteID){
            newListimgs.push(imGent);
          }
        }
        setDefaultImagesList(newListimgs);
      }else{
        NotificationManager.error("حدث خطأ اثناء حذف الصورة", 'عفواً', 3000);
      }
    });
  }

  const _getBrancheDetails = ( branch_id ) => {
      Api.Branches.details(branch_id).then((res)=>{
        if(res.statusCode === 200 && res.data?.branchDetails?.length){
          const { branchDetails } = res.data;
          if(branchDetails[0]?.lat && branchDetails[0]?.lat){
            setLatitude(branchDetails[0].lat);
            setLongitude(branchDetails[0].lon); 
          }
          setBranchData(branchDetails[0]);
          if(res.data && res.data.branchImages){
            setDefaultImagesList(res.data.branchImages);
          }
        }else{
          setLoadingData(false);
          setBranchData(null);
          setMessages(res.statusName);
          setAlertType('red');
          NotificationManager.error("حدث خطأ اثناء إسترجاع بيانات الفرع", 'عفواً', 3000);
        }
      });
  }

  useEffect(() => {
    if(branchData){
      _getAllCities();
      _getAllCategories();
      _getSubCategories();
      _getProvidersList();

      let branchCurrentData = { 
        branch_name: branchData.branch_name,
        branch_desc: branchData.branch_desc,
        whats: branchData.whats,
        twitter: branchData.twitter,
        facebook: branchData.facebook,
        snapchat: branchData.snapchat,
        insta: branchData.insta,
        telephone: branchData.telephone,
        city_id: branchData.city_id,
        category_id: branchData.category_id,
        email: branchData.email,
        lat: branchData.lat,
        lon: branchData.lon,
        sub_cat_id: branchData.sub_cat_id,
        provider_id: branchData.provider_id
      };
      reset(branchCurrentData);
      console.log("BranchData", branchCurrentData);
      // setTimeout(() => {
      //   setValue(branchCurrentData);
      // }, 500);
    }
  }, [branchData])

  useEffect(() => {
    if(providersList && subCategories && branchData && cityID && categoryID && subCategoryID && selectedProvider && selectedCity && citiesList && categoriesList){
      setLoadingData(false);
    }
    setTimeout(() => {
      setLoadingData(false);
    }, 3000)
  }, [longitude, latitude, providersList, subCategories, defaultImagesList, imagesList, branchData, cityID, categoryID, subCategoryID, selectedProvider, selectedCity, selectedCat, selectedSubCat, citiesList, categoriesList])
 

  const _onMarkerDragEnd = (e) => {
    setUpdated(false);
    setLatitude(e.latLng.lat())
    setLongitude(e.latLng.lng())
  };
  
  const _onPlacesChanged = (address, coords) => {
    if(coords) setLatitude(coords.latitude);
    if(coords) setLongitude(coords.longitude);
    if(address) setAddress(address);
  };

  const _getProvidersList = () => {
    let data = {
      start: 0,
      end: 1000
    }
    Api.Providers.all(data).then((res)=>{
      if(res.statusCode === 200){
        let plist = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          if(element.full_name){
            plist.push({label:element.full_name, value:element.provider_id});
            if(element.provider_id == branchData.provider_id){
              setSelectedProvider({label:element.full_name, value:element.provider_id});
            }
          }
        }
        setProvidersList(plist);
      }
    });
  }

  const _getAllCities = () => {
    Api.Cities.all().then((res)=>{
      if(res.statusCode === 200){
        let citlist = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          citlist.push({label:element.city, value:element.id});
          if(element.id == branchData.city_id){
            setCityID({label:element.city, value:element.id});
            setSelectedCity({label:element.city, value:element.id});
          }
        }
        setCitiesList(citlist);
      }
    });
  }

  const _getAllCategories = () => {
    Api.Categories.all().then((res)=>{
      if(res.statusCode === 200){
        let catlist = [];
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          catlist.push({label:element.type_name, value:element.id});
          if(element.id == branchData.category_id){
            setCategoryID({label:element.type_name, value:element.id});
            setSelectedCat({label:element.type_name, value:element.id});
          }
        }
        setCategoriesList(catlist);
      }
    });
  }

  const _getSubCategories = () => {
    Api.Categories.sub().then((res)=>{
      if(res.statusCode === 200){
        setSubCategories(res.data);
        for (let index = 0; index < res.data.length; index++) {
          const element = res.data[index];
          if(element.id == branchData.category_id){
              for (let xex = 0; xex < element.sub_categories.length; xex++) {
                const eSubcat = element.sub_categories[xex];    
                if(eSubcat.id == branchData.sub_cat_id){
                  setSubCategoryID({label:eSubcat.name, value:eSubcat.id});
                  setSelectedSubCat({label:eSubcat.name, value:eSubcat.id});
                } 
              }
          }
        }
      }
    });
  }

  const _updateSubCategories = (cat) => {
    setCategoryID(cat);
    let subcat = [];
    for (let index = 0; index < subCategories.length; index++) {
      const element = subCategories[index];
      if(element.id === cat.value){
        for (let sx = 0; sx < element.sub_categories.length; sx++) {
          const subelem = element.sub_categories[sx];
          subcat.push({label:subelem.name, value:subelem.id});
        }
      }
    }
    setSubCategoriesList(subcat);
  }

  const _setProviderID = fields => {
    setProviderID(fields.value)
  }

  const _updateBranch = data => {
    Api.Branches.update(data).then((res)=>{
      if(res.statusCode === 200){
        NotificationManager.success('تم تحديث بيانات فرع '+ data.branch_name +' بنجاح ', 'نجاح', 3000);
        if(imagesList && imagesList.length > 0){
          _uploadBranchImages(id);
        }else{
          NotificationManager.success('تم تحديث بيانات فرع '+ data.branch_name +' بنجاح ', 'نجاح', 3000);
          setTimeout(() => {
            setLoadingData(false);
            router.push('/providers/branches');
          }, 1000);
        }
      }else{
        NotificationManager.error('حدث خطأ اثناء تحديث بيانات الفرع', 'عفواً', 3000);
        setLoadingData(false);
        router.push('/providers/branches');
      }
    });
  }

  const _uploadBranchImages = branch => {
    var data = {id: branch, images: imagesList};
    Api.Branches.uploadBranchImages(data).then((res)=>{
      NotificationManager.success('تم إضافة فرع صور الفرع بنجاح ', 'نجاح', 3000);
      setTimeout(() => {
        setLoadingData(false);
        router.push('/providers/branches');
      }, 2000);
    });
  }

  const onSubmit = fields => {
    setLoadingData(true);
    let data = {
      ...fields,
      lat: latitude,
      lon: longitude,
      city_id: cityID.value,
      category_id: categoryID.value,
      sub_cat_id: subCategoryID.value,
      branch_id: id,
      address: address ? address : branchData.address,
      status: fields.status ? fields.status : 2
    }
    _updateBranch(data);
  }

  return (
    <Container>
      { loadingData ? ( 
        <Layout>
          <LoadingModal />
        </Layout>
      ) : (
        <Layout>
          { branchData === null ? (
            <div className="flex justify-center w-11/12 content-center" style={{paddingTop:200}} > 
              <div className="w-15 h-20 text-center text-xl text-gray-800 bg-white">
                  {messages &&
                    <Alert color="red" closeable={true} type="warning" raised flat >
                      {messages}
                    </Alert>
                  }
              </div>
            </div>
          ) : (
            <div>
              {confirmModal && (
                <Modal change={()=>_confirmRemoveBranchImage()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف الصورة ؟'} options={null} />
              )}
              <Widget className="relative" title="تعديل بيانات الفرع" description={""}>
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="text-sm mb-4 w-full"
                    defaultValue  
                  >
                  <div className="customActLinks">
                    <div
                      className="px-10 py-3 mt-1 uppercase font-bold text-white bg-gray-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-left mr-2"
                      onClick={()=> router.back() }
                    >إلغاء</div>
                    <input
                      type="submit"
                      className="px-4 py-3 mt-1 uppercase font-bold text-white bg-pink-700 rounded-full cursor-pointer hover:bg-pink-800 focus:outline-none active:outline-none float-left ml-2"
                      value="تحديث الفرع"
                    />
                  </div>
                  {messages && (
                    <Alert color="red" raised flat >
                        {messages}
                    </Alert>
                  )}
                  <Widget title="" className="mt-10 bg-gray-100 w-10/12" >
                      <div className="flex-col w-96 mb-4 ml-6 float-right">
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>اسم الفرع</span>
                              <input
                                name="branch_name"
                                type="text"
                                ref={register({required: true})}
                                className="form-input mt-1 text-xs block w-full bg-white placeholder-gray-400 mt-2"
                                placeholder="ادخل اسم الفرع"
                              />
                            </label>
                          </div>
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>إختر مقدم الخدمة</span>
                              <Select name="provider_id" options={providersList} className="w-full mt-2" placeholder={"-- إختر مقدم الخدمة --"} onChange={(data)=> { _setProviderID(data); setSelectedProvider(data)}} defaultValue={selectedProvider} />
                            </label>
                          </div>
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>المدينة</span>
                              <Select name="city_id" options={citiesList} className="w-full mt-2" placeholder={"-- إختر المدينة --"} onChange={(data)=> { setCityID(data); setSelectedCity(data)}} defaultValue={selectedCity} />
                            </label>
                          </div>
                          <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>البريد الإلكتروني</span>
                              <input
                                name="email"
                                type="email"
                                ref={register({required: true})}
                                className="form-input mt-1 text-xs block w-full bg-white mt-2"
                                placeholder="ادخل البريد الإلكتروني"
                              />
                            </label>
                        </div>
                      </div>
                      <div className="flex-col w-96 mb-4 ml-6 float-right">
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>التصنيف الرئيسي</span>
                              <Select name="category_id" options={categoriesList} className="w-full mt-2" placeholder={"-- إختر التصنيف الرئيسي --"} onChange={(data)=> { _updateSubCategories(data); setSelectedCat(data)}} defaultValue={selectedCat} />
                            </label>
                          </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                            <label className="block">
                              <span className="text-default"><b className="ml-1 text-s text-red-500">*</b>التصنيف الفرعي</span>
                              <Select name="sub_cat_id" options={subCategoriesList} className="w-full mt-2" placeholder={"-- إختر التصنيف الفرعي --"} onChange={(data)=> { setSubCategoryID(data); setSelectedSubCat(data)} } defaultValue={selectedSubCat} />
                            </label>
                          </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">رقم الجوال</span>
                            <input
                              name="telephone"
                              type="number"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل رقم الجوال"
                            />
                          </label>
                        </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">رقم الواتس</span>
                            <input
                              name="whats"
                              type="number"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل رقم الواتس"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex-col w-96 mb-4 ml-6 float-right">
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">حساب تويتر</span>
                            <input
                              name="twitter"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل حساب تويتر"
                            />
                          </label>
                        </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">حساب فيسبوك</span>
                            <input
                              name="facebook"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل حساب فيسبوك"
                            />
                          </label>
                        </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">حساب سناب شات</span>
                            <input
                              name="snapchat"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل حساب سناب شات"
                            />
                          </label>
                        </div>
                        <div className="w-full mb-6 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">حساب انستغرام</span>
                            <input
                              name="insta"
                              type="text"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="ادخل حساب انستغرام"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex-col w-full mb-2 ml-6 float-right">
                        <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default">معلومات عن الفرع</span>
                            <textarea
                              name="branch_desc"
                              ref={register({required: true})}
                              className="form-input mt-1 text-xs block w-full bg-white mt-2"
                              placeholder="اكتب معلومات عن الفرع"
                              style={{minHeight:110}}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="flex-col w-full mb-2 ml-6 float-right">
                        <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default mb-2 block">صور الفرع (10 صور كـ حد اقصى)</span>
                          </label>
                          
                          <div className="form-group multi-preview addNewImageCont" >
                              {defaultImagesList.map((imag, index) => (
                                  <div className="float-right m-0 mb-5 border-8 border-transparent rounded shadow-sm w-1/5 h-48 imagecontainer relative">
                                      <img key={index} src={imag.img_path} className="" alt="..." />
                                      <i className="w-34 h-34 p-0 cursor-pointer rounded-full icon-close text-xl absolute right-0 top-0 text-white z-0" onClick={()=>_removeBranchImage(imag.id)} />
                                  </div>
                              ))}
                          </div>
                          <ImageSelector uploadImages={setImagesList} />
                        </div>
                      </div>

                      <div className="flex-col w-full mb-2 ml-6 float-right">
                        <div className="w-11/12 mb-12 p-5 bg-white border-2 border-gray-200">
                          <label className="block">
                            <span className="text-default mb-2 block">موقع الفرع</span>
                            <MapComponent
                              latitude={Number(latitude)}
                              longitude={Number(longitude)}
                              onMarkerDragEnd={_onMarkerDragEnd}
                              onSelectPlace={_onPlacesChanged}
                              updated={updated}
                            />
                          </label>
                        </div>
                      </div>

                      <div className="w-full clear-both">
                        <br></br>
                    </div>
                  </Widget>
                </form>
            </Widget>
            </div>
          )}
        </Layout>
      )}
    </Container>
  )
}

export default Index
