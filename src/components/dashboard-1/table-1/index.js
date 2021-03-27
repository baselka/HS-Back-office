import flags from '../../../json/navbar-flags.json'
import WidgetTitle from '../../../components/widget-title'
import {Badge} from '../../../components/badges'

const SectionTitle = ({title, subtitle}) => {
  return (
    <div className="flex items-center justify-between">
      <WidgetTitle title={title} description={subtitle} />
      <div className="flex flex-row children-x-2">
        <button className={`btn btn-icon h-8 w-8`}>
          <i className={`icon-settings text-base font-bold`}></i>
        </button>
        <button className={`btn btn-icon h-8 w-8`}>
          <i className={`icon-cursor text-base font-bold`}></i>
        </button>
        <button className={`btn btn-icon h-8 w-8`}>
          <i className={`icon-refresh text-base font-bold`}></i>
        </button>
      </div>
    </div>
  )
}

const TableWidget2 = () => {
  return (
    <table className="table striped">
      <thead>
        <tr>
          <th>Country</th>
          <th>Orders</th>
          <th>Sales</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {flags.slice(0, 6).map((flag, i) => (
          <tr key={i}>
            <td>
              <div className="flex items-center justify-start">
                <span
                  className={`text-lg flag-icon flag-icon-${flag.code}`}></span>
                <span className="ltr:ml-3 rtl:mr-3 text-sm font-medium">{flag.name}</span>
              </div>
            </td>
            <td>
              <div className="text-sm">{flag.amount}</div>
            </td>
            <td>
              <div className="text-sm">{flag.percent}</div>
            </td>
            <td>
              <Badge color={flag.color} alt size="sm" rounded>
                {flag.label}
              </Badge>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

const Widget = () => (
  <>
    <SectionTitle title="Countries" subtitle="Best online markets" />
    <TableWidget2 />
  </>
)

export default Widget
