import React from "react";

const ModalHeader = ({ cancel, head }) => (
  <div className='modal-header'>
    <h4 className='text-xl font-semibold'>{head}</h4>
    <button className='modal-close btn btn-transparent' onClick={cancel}>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
        className={`text-secondary stroke-current inline-block h-5 w-5`}>
        <line x1='18' y1='6' x2='6' y2='18'></line>
        <line x1='6' y1='6' x2='18' y2='18'></line>
      </svg>
    </button>
  </div>
);

const ModalBody = props => {
  console.log("props", props);
  return (
    <div className='relative p-4 flex-auto'>
      <p className='mb-3'>{props.body} </p>
    </div>
  );
};

const ModalFooter = ({ cancel, deleteConfirm }) => (
  <div className='modal-footer children-x-2'>
    <button
      className='btn btn-default btn-red btn-rounded'
      type='button'
      onClick={deleteConfirm}>
      تاكيد
    </button>
    <button
      className='btn btn-default btn-red btn-rounded'
      type='button'
      onClick={cancel}>
      تراجع
    </button>
  </div>
);

const DeleteModal = ({ cancel, title, message, deleteConfirm, id }) => {
  return (
    <>
      <div className='backdrop fade-in fixed inset-0 z-40 bg-black'></div>
      <div className='modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-3/12 my-4 mx-auto max-w-lg'>
          <div className='modal-content'>
            <ModalHeader cancel={() => cancel()} head={title} />
            <ModalBody body={message} />
            <ModalFooter
              cancel={() => cancel()}
              deleteConfirm={() => deleteConfirm(id)}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
