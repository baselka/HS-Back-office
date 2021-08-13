import React from 'react'
import {useTable, useSortBy, usePagination, useRowSelect} from 'react-table'
import {PageWithText, Page} from '../pagination'

const IndeterminateCheckbox = React.forwardRef(
  ({indeterminate, ...rest}, ref) => {
    const defaultRef = React.useRef()
    const resolvedRef = ref || defaultRef

    React.useEffect(() => {
      resolvedRef.current.indeterminate = indeterminate
    }, [resolvedRef, indeterminate])

    return (
      <input
        type="checkbox"
        ref={resolvedRef}
        {...rest}
        className="form-checkbox h-4 w-4"
      />
    )
  }
)

const Datatable = ({columns, data, pagination, goToPage}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = useTable(
    {
      columns,
      data,
      initialState: {pageIndex: 0, pageSize: 20}
    },
    useSortBy,
    usePagination,
    useRowSelect,
    hooks => {
      hooks.visibleColumns.push(columns => [
        // Let's make a column for selection
        {
          id: 'selection',
          // The header can use the table's getToggleAllRowsSelectedProps method
          // to render a checkbox
          // Header: ({getToggleAllRowsSelectedProps}) => (
          //   <>
          //     <IndeterminateCheckbox {...getToggleAllRowsSelectedProps()} />
          //   </>
          // ),
          // The cell can use the individual row's getToggleRowSelectedProps method
          // to the render a checkbox
          // Cell: ({row}) => (
          //   <>
          //     <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} />
          //   </>
          // )
        },
        ...columns
      ])
    }
  )

  // Render the UI for your table
  return (
    <>
      <table {...getTableProps()} className="table customTableHdrs striped">
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())} >
                  <div className="items-center justify-center text-center">
                    <span>{column.render('Header')}</span>
                    {/* Add a sort direction indicator */}
                    <span className="ltr:ml-auto rtl:mr-auto">
                      {column.isSorted ? (
                        column.isSortedDesc ? (
                          <icon className="icon-arrow-down text-xxs" />
                        ) : (
                          <icon className="icon-arrow-up text-xxs" />
                        )
                      ) : (
                        ''
                      )}
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row)
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => {
                  return <td {...cell.getCellProps()} style={{textAlign:'center'}} >{cell.render('Cell')}</td>
                })}
              </tr>
            )
          })}
        </tbody>
      </table>

      <div className="flex flex-row items-center justify-between my-4">

      <div className="items-center w-full justify-center text-center children-x-2 pagination">
          {(pagination.cuurentPage > 1) ? (
            <PageWithText
              onClick={() => goToPage(pagination.cuurentPage-2)}
              color="text-default">
              الصفحة السابقة
            </PageWithText>
          ): null}

        <span>
          <b>
            {pagination.cuurentPage} من {pagination.pageCount}
          </b>{' '}
        </span>

          {(pagination.cuurentPage < pagination.pageCount) ? (
            <PageWithText
              onClick={() => goToPage(pagination.cuurentPage)}
              color="text-default"
            >
              الصفحة التالية
            </PageWithText>
          ): null}
        </div>
      </div>
    </>
  )
}

export default Datatable
