import "./style.css";
import PropTypes from "prop-types";
import { Character } from "../../models/Character";

export default function Languages(props) {
  const character = new Character(props.character);

  return (
    <>
      <div className="d-flex">
        <h2 className="section-title" type="button" data-bs-toggle="collapse" data-bs-target="#character-view-languages" aria-expanded="false" aria-controls="character-view-languages">
          Languages
        </h2>
        <button className="btn btn-secondary button-edit">Edit</button>

      </div>

      <div id="character-view-languages" className="collapse show">
        <div className="card card-body">
          Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
        </div>
      </div>
    </>
  )
}

Languages.propTypes = {
  character: PropTypes.object
}