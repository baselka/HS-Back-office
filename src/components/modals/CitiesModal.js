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
  if (props.type === "edit") {
    return (
      <form className=' p-4 flex-auto'>
        {props.error && (
          <div>
            <p className='text-red-600'>ادخل المدينه والمنطقه</p>
          </div>
        )}
        <label className='block'>
          <span className='text-sm text-default'>المدينه</span>
          <input
            type='text'
            placeholder={props.city}
            value={props.inputValues.city}
            onChange={props.handleCityChange}
            maxLength='10'
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
        <label htmlFor='add region' className='block'>
          <span className='text-sm text-default'>المنطقه</span>
          <input
            type='text'
            placeholder={props.region}
            value={props.inputValues.region}
            onChange={props.handleRegionChange}
            maxLength='10'
            className='text-sm form-input mt-1 block w-full border'
          />
        </label>
      </form>
    );
  }
  return (
    <form className=' p-4 flex-auto'>
      {props.error && (
        <div>
          <p className='text-red-600'>ادخل المدينه والمنطقه</p>
        </div>
      )}
      <label className='block'>
        <span className='text-sm text-default'>المدينه</span>
        <input
          name='city'
          onChange={props.handleCityChange}
          value={props.inputValues.city}
          type='text'
          placeholder='اكتب إسم المدينه'
          maxLength='10'
          className='text-sm form-input mt-1 block w-full border'
        />
      </label>
      <label htmlFor='add region' className='block'>
        <span className='text-sm text-default'>المنطقه</span>
        <input
          name='region'
          onChange={props.handleRegionChange}
          value={props.inputValues.region}
          type='text'
          placeholder='اكتب إسم المنطقه'
          maxLength='10'
          className='text-sm form-input mt-1 block w-full border'
        />
      </label>
    </form>
  );
};

const ModalFooter = ({ cancel, handleSubmit }) => (
  <div className='modal-footer children-x-2'>
    <button
      className='btn btn-default btn-red rounded-full'
      type='submit'
      onClick={handleSubmit}>
      تاكيد
    </button>
    <button
      className='btn btn-default btn-red rounded-full'
      type='button'
      onClick={cancel}>
      تراجع
    </button>
  </div>
);

const CitiesModal = ({
  cancel,
  title,
  type,
  inputValues,
  handleSubmit,
  handleCityChange,
  handleRegionChange,
  error
}) => {
  return (
    <>
      <div className='backdrop fade-in fixed inset-0 z-40 bg-black'></div>
      <div className='modal show justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
        <div className='relative w-3/12 my-4 mx-auto max-w-lg'>
          <div className='modal-content'>
            <ModalHeader cancel={() => cancel()} head={title} />
            <ModalBody
              handleCityChange={handleCityChange}
              handleRegionChange={handleRegionChange}
              type={type}
              inputValues={inputValues}
              error={error}
            />
            <ModalFooter cancel={() => cancel()} handleSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </>
  );
};

export default CitiesModal;
