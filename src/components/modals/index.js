import React from 'react'

const ModalHeader = ({cancel, head}) => (
  <div className="modal-header">
    <h4 className="text-xl font-semibold">{head}</h4>
    <button
      className="modal-close btn btn-transparent"
      onClick={cancel}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`text-secondary stroke-current inline-block h-5 w-5`}>
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  </div>
)

const ModalBody = (prop) => {
  console.log('ModalBody', prop);
  if(prop.showInput){
    return (
      <div className="relative p-4 flex-auto">
        <p className="mb-3" >{"ادخل كلمة المرور الجديدة"}</p>
        <input type="password" placeholder={"ادخل كلمة المرور"} onChange={(e)=>prop.keyInput(e.target.value)} className="w-full h-10 border-2 rounded-3xl	border-gray-400	p-2" />
      </div>
    )
  }
  if(!prop.list) {
    return (
      <div className="relative p-4 flex-auto">
        <p className="mb-3" >{prop.body}</p>
      </div>
    )
  }
  return (
    <div className="relative p-4 flex-auto">
      <p className="mb-3" >{prop.body} :</p>
      <>
        { prop.list && prop.list.length > 0 ? (
          <>
            {prop.list.map(function(item, index){
              if(item.city){
                return <div className="w-12/12 bg-pink-700 cursor-pointer rounded-lg text-white m-1 text-center py-2 hover:bg-pink-900" key={ index } onClick={()=>prop.change(item.id)} >{item.city}</div>;
              }
              if(item.type_name){
                return <div className="w-12/12 bg-pink-700 cursor-pointer rounded-lg text-white m-1 text-center py-2 hover:bg-pink-900" key={ index } onClick={()=>prop.change(item.id)} >{item.type_name}</div>;
              }
              if(item.name){
                return <div className="w-12/12 bg-pink-700 cursor-pointer rounded-lg text-white m-1 text-center py-2 hover:bg-pink-900" key={ index } onClick={()=>prop.change(item.id)} >{item.name}</div>;
              }
            })}
          </>
         ) : (
           <p className="text-red-900 my-3" >عفوا : لاتوجد اختيارات</p>
         )
        }
      </>
    </div>
  )
}

const ModalFooter = ( prop ) => (
  <div className="modal-footer children-x-2">
    {prop.confirm &&
      <button
        className="btn btn-default btn-green rounded-full float-right"
        type="button"
        onClick={prop.confirm}>
          {'تأكيد'}
      </button>
    }
    {prop.cancel &&
      <button
        className="btn btn-default btn-red rounded-full float-left mr-4 ml-4"
        type="button"
        onClick={prop.cancel} >
          {'تراجع'}
      </button>
    }
  </div>
)

const Modal = ({change, cancel, title, message, options, hasInput, newPwd}) => {
  return (
    <>
      <div className="backdrop fade-in fixed inset-0 z-40 bg-black"></div>
      <div className="modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-3/12 my-4 mx-auto max-w-lg bg-white-900 direction-rtl">
          <div className="modal-content">
            <ModalHeader cancel={() => cancel()} head={title} />
            <ModalBody body={message} list={options} change={change} showInput={hasInput} keyInput={newPwd} />
            <ModalFooter cancel={() => cancel()} confirm={options ? false : ()=>change()} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal
