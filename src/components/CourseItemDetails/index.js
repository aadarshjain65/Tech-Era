import {Component} from 'react'
import TailSpin from 'react-loader-spinner'

import Header from '../Header'
import Failure from '../Failure'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseItemDetails extends Component {
  state = {courseItemDetails: {}, apiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.getCourseDetails()
  }

  getCourseDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const url = `https://apis.ccbp.in/te/courses/${id}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(url, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = {
        id: fetchedData.course_details.id,
        name: fetchedData.course_details.name,
        imageUrl: fetchedData.course_details.image_url,
        description: fetchedData.course_details.description,
      }

      this.setState({
        courseItemDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onRetry = () => {
    this.getCourseDetails()
  }

  renderSuccessView = () => {
    const {courseItemDetails} = this.state
    const {imageUrl, name, description} = courseItemDetails

    return (
      <div className="courses-item-container">
        <div className="course-item-card-container">
          <img className="course-item-image" src={imageUrl} alt={name} />
          <div className="course-item-details-section">
            <h1 className="course-item-name">{name}</h1>
            <p className="course-item-description">{description}</p>
          </div>
        </div>
      </div>
    )
  }

  renderFailureView = () => <Failure onRetry={this.onRetry} />

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <TailSpin height="20" width="20" color="#4656a1" />
    </div>
  )

  renderCourseDetailsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        {this.renderCourseDetailsView()}
      </div>
    )
  }
}

export default CourseItemDetails
