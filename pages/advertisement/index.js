import React, { useState, useEffect } from "react";
import Container from "../Container";
import Layout from "../../src/layouts";
import SectionTitle from "../../src/components/section-title";

import AdsModal from "../../src/components/modals/AdsModal";
import DeleteModal from "../../src/components/modals/DeleteModal";
import api from "../../src/api";
import moment from "moment";

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
    branch_id: 1,
    redirectUrl: ""
  });
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [deleteModalMessage, setDeleteModalMessage] = useState("");
  const [deleteModalTitle, setDeleteModalTitle] = useState("");
  const [deleteModal, setDeleteModal] = useState("");
  const [error, setError] = useState(false);
  const [branches, setBranches] = useState([]);
  const [searchfield, setSearchfield] = useState("");
  // component did mount
  useEffect(() => {
    _getAllAds();
    _getAllBranches();
  }, []);

  const _getAllBranches = () => {
    api.Branches.all(0, 1000).then(res => {
      if (res.statusCode === 200) {
        setBranches(res.data);
      }
    });
  };
  const _getAllAds = () => {
    api.Ads.all().then(res => {
      if (res.statusCode === 200) {
        setAds(res.data);
      }
    });
  };

  const add = () => {
    setType("add");
    setAdsModalTitle("اضف اعلانك");
    setAdsModal(true);
    setError(false);
  };

  const edit = ad => {
    setType("edit");
    const id = ad.id;
    const name = ad.ad_text;
    const redirectUrl = ad.redirect_url;
    const file = ad.ad_img;
    const branch_id = ad.branch_id;
    const start = ad.start_date;
    const end = ad.end_date;

    setInputValues({
      id,
      name,
      redirectUrl,
      file,
      branch_id,
      start,
      end
    });
    setType("edit");
    setError(false);
    setAdsModalTitle("تعديل");
    setAdsModal(true);
  };

  const handleImageChange = e => {
    setInputValues({ ...inputValues, file: e.target.files[0] });
  };

  const handleNameChange = e => {
    setInputValues({ ...inputValues, name: e.target.value });
  };

  const handleRedirectUrlChange = e => {
    setInputValues({ ...inputValues, redirectUrl: e.target.value });
  };

  const handleBranchChange = e => {
    setSearchfield(e.target.value);
  };
  const handleDropDownChange = e => {
    setInputValues({ ...inputValues, branch_id: Number(e.target.value) });
  };
  const filteredBranches = branches.filter(branch => {
    return branch.branch_name.toLowerCase().includes(searchfield.toLowerCase());
  });
  const startDateChange = date => {
    setStartDate(date);
    console.log(" startDateChange ", date);
  };
  const endDateChange = date => {
    setEndDate(date);
    console.log("endDateChange", date);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (
      inputValues.name === "" ||
      inputValues.redirectUrl === "" ||
      inputValues.file === "" ||
      inputValues.branch_id === ""
    ) {
      setError(true);
    } else {
      if (!inputValues.id) {
        const newstartDate = moment(startDate).format("YYYY-MM-DD");
        const newendDate = moment(endDate).format("YYYY-MM-DD");
        setType("add");
        console.log("add", "inputValues", inputValues);
        var formdata = new FormData();
        formdata.append("branch_id", inputValues.branch_id);
        formdata.append("ad_text", inputValues.name);
        formdata.append("redirect_url", inputValues.redirectUrl);
        formdata.append("images", inputValues.file);
        formdata.append("start_date", newstartDate);
        formdata.append("end_date", newendDate);

        api.Ads.add(formdata).then(res => {
          console.log("_getAllAds", res);
          if (res.statusCode === 200) {
            console.log("added", formdata);
            _getAllAds();
          }
        });
      } else {
        setType("edit");
        const newstartDate = moment(startDate).format("YYYY-MM-DD");
        const newendDate = moment(endDate).format("YYYY-MM-DD");
        const data = {
          id: inputValues.id,
          ad_text: inputValues.name,
          redirect_url: inputValues.redirectUrl,
          branch_id: inputValues.branch_id,
          file: inputValues.file,
          start_date: newstartDate,
          end_date: newendDate
        };
        api.Ads.update(data).then(res => {
          console.log("_getAllAds", res);
          if (res.statusCode === 200) {
            console.log("updated");
            _getAllAds();
          }
        });
      }

      setInputValues({
        id: "",
        name: "",
        redirectUrl: "",
        file: null,
        branch_id: 1,
        start: null,
        end: null
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
      if (res.statusCode === 200) {
        console.log("deleted");
        _getAllAds();
      }
      setDeleteModal(false);
    });
  };

  // console.log(ads, "ads");

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
            handleDropDownChange={handleDropDownChange}
            handleNameChange={handleNameChange}
            handleRedirectUrlChange={handleRedirectUrlChange}
            startDateChange={date => startDateChange(date)}
            endDateChange={date => endDateChange(date)}
            handleSubmit={handleSubmit}
            branches={filteredBranches}
            inputValues={inputValues}
            ads={ads}
            startDate={startDate}
            endDate={endDate}
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
          {!ads.length && (
            <div className='flex flex-wrap  justify-center '>
              <span>لا يوجد اعلانات لعرضها...</span>{" "}
            </div>
          )}
          {ads &&
            ads.map(ad => {
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
                      {ad.redirect_url}
                    </h2>
                    <div className='mb-4 text-grey-darker text-sm flex-1'>
                      <h6>
                        {" "}
                        بداية العرض {moment(ad.start_date).format("YYYY-MM-DD")}
                      </h6>

                      <h6>
                        {" "}
                        نهاية العرض {moment(ad.end_date).format("YYYY-MM-DD")}
                      </h6>
                    </div>

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
