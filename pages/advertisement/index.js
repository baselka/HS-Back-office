import React, { useState, useEffect } from "react";
import Container from "../Container";
import Layout from "../../src/layouts";
import SectionTitle from "../../src/components/section-title";

import AdsModal from "../../src/components/modals/AdsModal";
import DeleteModal from "../../src/components/modals/DeleteModal";
import api from "../../src/api";

const Index = () => {
  const [id, setId] = useState("");
  const [type, setType] = useState("");
  const [ads, setAds] = useState([]);
  const [adsModal, setAdsModal] = useState(false);
  const [adsModalTitle, setAdsModalTitle] = useState("");
  const [inputValues, setInputValues] = useState({
    id: "",
    name: "",
    file: "",
    // branch_id: 1,
    redirectUrl: ""
  });

  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState("");
  const [error, setError] = useState(false);

  // component did mount
  useEffect(() => {
    _getAllAds();
  }, []);

  const _getAllAds = () => {
    api.Ads.all().then(res => {
      console.log("_getAllAds", res);
      if (res.statusCode === 200) {
        console.log(res, "res");
        setAds(res.data);
      }
    });
  };

  const add = () => {
    setType("ad");
    setAdsModalTitle("اضف اعلانك");
    setAdsModal(true);
    setError(false);
  };

  const edit = ad => {
    const id = ad.id;
    const name = ad.name;
    const redirectUrl = ad.redirectUrl;
    const file = ad.file;
    const branch_id = ad.branch_id;
    setId(id);
    setInputValues({
      id,
      name,
      redirectUrl,
      file,
      branch_id
    });
    setType("edit");
    setError(false);
    setAdsModalTitle("تعديل");
    setAdsModal(true);
  };

  const handleImageChange = e => {
    const file = URL.createObjectURL(e.target.files[0]);
    setInputValues({ ...inputValues, file: file });
  };

  const handleNameChange = e => {
    setInputValues({ ...inputValues, name: e.target.value });
  };

  const handlerediRectUrlChange = e => {
    setInputValues({ ...inputValues, redirectUrl: e.target.value });
  };

  const handleBranchChange = e => {
    setInputValues({ ...inputValues, branch_id: Number(e.target.value) });
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (
      inputValues.name === "" ||
      inputValues.redirectUrl === "" ||
      inputValues.file === ""
    ) {
      setError(true);
    } else {
      if (!inputValues.id) {
        console.log("adddddddddddddddddddddddddd", inputValues);
      } else {
        console.log("updateeeeeeeeeeeeeeeeee", inputValues);
        const copyOfads = ads.filter(ad => ad.id !== id);
        const name = inputValues.name;
        const redirectUrl = inputValues.redirectUrl;
        setInputValues({
          id: id,
          name,
          redirectUrl,
          branch_id
        });
        const newAds = [...copyOfads, inputValues];
        setAds(newAds);
      }

      setInputValues({
        id: "",
        name: "",
        redirectUrl: "",
        file: null,
        branch_id: 1
      });
      setAdsModal(false);
      setError(false);
    }
  };

  const deleteAd = ad => {
    const id = ad.id;
    setId(id);
    setDeleteModalTitle("حذف");
    setDeleteModal(true);
    setDeleteModalMessage("هل انت متاكد تريد الحذف؟");
  };

  const confirmDelete = () => {
    //call api
    api.Ads.delete(id).then(res => {
      console.log(id);
      console.log("_getAllAds", res);
      if (res.statusCode === 202) {
        console.log("deleted");
        _getAllAds();
      }
      setDeleteModal(false);
    });
  };

  console.log(ads, "ads");

  const deleteImage = () => {
    let file = null;
    setInputValues({ ...inputValues, file: file });
  };
  return (
    <Container>
      <Layout>
        <SectionTitle
          title='إدارة الإعلانات والعروض'
          subtitle='إدارة الإعلانات'
        />

        {adsModal && (
          <AdsModal
            cancel={() => setAdsModal(false)}
            type={type}
            title={adsModalTitle}
            handleImageChange={e => handleImageChange(e)}
            handleBranchChange={e => handleBranchChange(e)}
            handleNameChange={handleNameChange}
            handlerediRectUrlChange={handlerediRectUrlChange}
            handleSubmit={handleSubmit}
            inputValues={inputValues}
            ads={ads}
            deleteImage={() => deleteImage()}
            id={inputValues.id}
            error={error}
          />
        )}
        {deleteModal && (
          <DeleteModal
            cancel={() => setDeleteModal(false)}
            deleteConfirm={id => confirmDelete(id)}
            title={deleteModalTitle}
            message={deleteModalMessage}
            id={inputValues.id}
          />
        )}
        <button
          className='btn btn-default btn-pink rounded-full btn-icon mr-1 ml-1 sm:w-1/5  md:w-1/12  '
          onClick={() => add()}>
          اضافة اعلان
        </button>
        <div className='flex flex-wrap  justify-start '>
          {ads &&
            ads.map(ad => {
              console.log("add.image", ad.ad_img);
              return (
                <div
                  key={ad.id}
                  className='overflow-hidden border bg-white rounded-lg shadow-lg m-10 w-full sm:w-2/3 md:w-1/4 flex flex-col p-3'>
                  <img
                    className='bg-center object-cover w-full  h-48 '
                    src={ad.ad_img}
                  />
                  <div>
                    <h1 className='mb-4 text-2xl'>{ad.ad_text}</h1>
                    <h2 className='mb-4 text-grey-darker text-sm flex-1'>
                      LINK{ad.redirect_url}
                    </h2>

                    <div className='flex flex-row '>
                      <button
                        onClick={() => deleteAd(ad)}
                        className='btn btn-default btn-red rounded-full btn-icon mr-1 ml-1 w-1/2'>
                        <i className='icon-trash font-bold mr-1 ml-1' />
                      </button>
                      <button
                        onClick={() => edit(ad)}
                        className='btn btn-default btn-yellow rounded-full btn-icon mr-1 ml-1 w-1/2'>
                        <i className='icon-note font-bold mr-1 ml-1' />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </Layout>
    </Container>
  );
};

export default Index;
