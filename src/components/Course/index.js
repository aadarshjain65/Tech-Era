import {Link} from 'react-router-dom'

import './index.css'

const Course = props => {
  const {courseItemDetails} = props
  const {id, name, logoUrl} = courseItemDetails

  return (
    <Link to={`courses/${id}`} className="link-item">
      <li className="courses-list-item">
        <img className="course-image" src={logoUrl} alt={name} />
        <p className="course-name">{name}</p>
      </li>
    </Link>
  )
}

export default Course
