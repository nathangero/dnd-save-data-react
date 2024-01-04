import "./style.css";
import PropTypes from "prop-types";
import { Character } from "../../models/Character";

export default function AbilityScores(props) {
  const character = new Character(props.character);

  return (
    <>
      <div className="d-flex">
        <h2 className="section-title" type="button" data-bs-toggle="collapse" data-bs-target="#character-view-scores" aria-expanded="false" aria-controls="character-view-scores">
          Ability Scores
        </h2>
        <button className="btn btn-secondary button-edit">Edit</button>
      </div>

      <div id="character-view-scores" className="collapse show">
        <div className="card card-body">
          Some placeholder content for the collapse component. This panel is hidden by default but revealed when the user activates the relevant trigger.
        </div>
      </div>
    </>
  )
}

AbilityScores.propTypes = {
  character: PropTypes.object
}