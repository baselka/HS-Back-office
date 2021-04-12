import React, { useState, useEffect } from "react";
import Container from "../../Container";
import Layout from "../../../src/layouts";
import SectionTitle from "../../../src/components/section-title";
import LoadingModal from "../../../src/components/modals/LoadingModal";
import Datatable from "../../../src/components/datatable";
import Modal from '../../../src/components/modals'
import Widget from "../../../src/components/widget";
import { Alert } from '../../../src/components/alerts';
import Link from 'next/link'
import Api from "../../../src/api";
import { useRouter } from "next/router";
import { NotificationManager } from 'react-notifications'

export async function getServerSideProps(context) {
  return {
    props: {}
  };
}

const Simple = ({ features, deletec }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "الصورة",
        accessor: "image",
        Cell: props => {
          return (
            <div className='flex justify-center'>
              <img
                src={props.row.original.image}
                alt='image'
                className={`w-8 shadow rounded max-w-full border-none`}
              />
            </div>
          );
        }
      },
      {
        Header: "الاسم",
        accessor: "name"
      },
      {
        Header: "الوصف",
        accessor: "description"
      },
      {
        Header: "ادوات",
        // accessor: 'id',
        Cell: props => {
          return (
            <div className={"flex-row "} >
              <div className={"inline-block"} >
                <Link href={"/app/features/edit/"+props.row.original.id} >
                  <a className="btn btn-default btn-blue rounded-full btn-icon inline-block w-24 mx-2">
                    <i className="icon-note font-bold mr-1 ml-1" />
                    تعديل
                  </a>
                </Link>
              </div>
              <div className={"inline-block"} >
                <button className="btn btn-default btn-red rounded-full btn-icon inline-block w-24 mx-2" onClick={()=>deletec(props.row.original.id)} >
                  <i className="icon-trash font-bold mr-1 ml-1" />
                  <span>حذف</span>
                </button>
              </div>
            </div>
          );
        }
      }
    ],
    []
  );
  return <Datatable columns={columns} data={features} />;
};

const Index = () => {
  const [messages, setMessages] = useState(false)
  const [confirmModal, setConfirmModal] = useState(false)
  const [loadingData, setLoadingData] = useState(true);
  const [catToDeleteID, setCatToDeleteID] = useState('')
  const [featureList, setFeatureList] = useState([])
  const [alertType, setAlertType] = useState('red')
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if(id){
      _getFeatures(id);
    }else{
      setLoadingData(false);
      setFeatureList(null);
      setMessages("عفوا : رقم الميزة غير صحيح");
      setAlertType('red');
      NotificationManager.error("رقم الميزة غير صحيح", 'عفواً', 3000);
    }
  }, []);

  const _deleteFeat = ( s_id ) => {
    setConfirmModal(true);
    setCatToDeleteID(s_id);
  }

  const _deleteFeatureConfirmed = () => {
    setConfirmModal(false);
    Api.Features.delete(catToDeleteID).then((res)=>{
      _getFeatures(id);
      console.log("res", res);
      NotificationManager.success("تم حذف الميزة بنجاح", 'نجاح', 3000);
    });
  }

  const _addNew = () => {
    router.push('/app/features/addNew/'+id);
  }

  const _getFeatures = ( cat_id ) => {
    console.log("category_id", cat_id);
    Api.Features.all(cat_id).then((res)=>{
      console.log("_getFeaturesList", res);
      setFeatureList(res?.data);
      setLoadingData(false);
    });
  }

  return (
    <Container>
      <Layout>

        {confirmModal && (
          <Modal change={()=>_deleteFeatureConfirmed()} cancel={()=>setConfirmModal(false)} title={'تأكيد'} message={'هل تريد فعلا حذف الميزة ؟'} options={null} />
        )}

        { loadingData ? (
          <LoadingModal />
        ) : (
          <>
            { featureList === null ? (
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
              <>
                <div className="relative flex text-sm mb-4">
                  <div className="w-10/12">
                    <SectionTitle
                      title='إدارة الأقسام'
                      subtitle='إدارة مزايا الاقسام'
                    />
                  </div>
                  <div className="customActLinks">
                    <div
                        className="px-10 py-3 mt-1 uppercase font-bold text-white bg-pink-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-left mr-2"
                        onClick={()=> _addNew() }
                    >
                      <i className="icon-plus font-bold mr-1 ml-1 mt-1" />
                      <span>إضافة ميزة جديدة</span>
                    </div>
                    <div
                        className="px-10 py-3 mt-1 uppercase font-bold text-white bg-gray-600 rounded-full cursor-pointer hover:bg-grey-800 focus:outline-none active:outline-none float-left mr-2"
                        onClick={()=> router.back() }
                    >
                      <span>عودة</span>
                    </div>
                  </div>
                </div>

                {featureList.length === 0 ? (
                  <div className={"bg-white"} >
                    <Alert color="red" closeable={true} type="warning" raised flat >
                      {"عفوا : لاتوجد مزايا حاليا لهذا التصنيف"}
                    </Alert>
                  </div>
                ):(
                  <Widget title={"قائمة المزايا" }>
                    <div className="">
                      <Simple features={featureList} deletec={_deleteFeat} />
                    </div>
                  </Widget>
                )}
                </>
              )}
            </>
          )}
      </Layout>
    </Container>
  );
};

export default Index;
