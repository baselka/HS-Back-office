import React, {useState} from 'react'
import Link from 'next/link'
import Item from './item'
import { useRouter } from 'next/router'

const List = ({items}) => {
  const [hidden, setHidden] = useState(true)
  const router = useRouter()

  const _isOpen = (links) => {
    const current = router.pathname;
    var opens = false;
    for (let index = 0; index < links.length; index++) {
      const element = links[index];
      if(current == element.url){
        opens = true;
      }
    }
    return opens;
  }

  return (
    <ul className="list-none px-4">
      <li
        className={`relative ${items.items.length > 0 ? 'right-arrow' : 'right-arrow'} ${
          hidden ? '' : 'is-open'
        }`}>

        {items.items.length === 0 && (
          <Link href={items.url}>
            <a className={`list-item children-x-2 ${_isOpen([items]) ? 'open-active-btn' : ''}`}>
              <Item {...items} />
            </a>
          </Link>
        )}

        {items.items.length > 0 && (
          <button
            className={`list-item children-x-2`}
            onClick={() => setHidden(!hidden)}>
            <Item {...items} />
          </button>
        )}

        {items.items.length > 0 && (
          <ul
            className={`list-none accordion ${hidden ? '' : 'open'} ${_isOpen(items.items) ? 'open' : ''} `} >
            {items.items.map((item, k) => (
              <li key={k} className="pr-2" >
                <Link href={item.url}>
                  <a
                    className={`list-item children-x-2 block ${_isOpen([item]) ? 'open-active-btn' : ''}`}
                  >
                    {item.icon &&
                      <>
                        {item.icon}
                      </>
                    }
                    {item.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </li>
    </ul>
  )
}

export default List
