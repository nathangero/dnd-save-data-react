import "./style.css";
import PropTypes from "prop-types";
import { Character } from "../../../models/Character";
import { useEffect, useState } from "react";
import { makeIdFromName, makeJumpToForSection, scrollToListItem } from "../../../utils/shared-functions";

export default function Equipment(props) {
  const character = new Character(props.character);

  const [jumpToMenu, setMenu] = useState({});

  useEffect(() => {
    // Make jump to menu
    setMenu(makeJumpToForSection(character.equipment));
  }, [])

  return (
    <div className="fs-3">
      <div className="character-view-header sticky-top pt-1">
        <div className="d-flex" role="button" onClick={() => props.toggleSectionShowing()} data-bs-toggle="collapse" data-bs-target="#character-view-equipment" aria-expanded="false" aria-controls="character-view-equipment">
          <h2 className="section-title equipment">
            Equipment
          </h2>
          {props.isShowingEquipment ?
            <i className="bi bi-chevron-down fs-3 px-3" aria-label="chevron-down"></i> :
            <i className="bi bi-chevron-up fs-3 px-3" aria-label="chevron-up"></i>
          }
        </div>

        <div className="dropdown">
          <div className={props.isShowingEquipment ? "d-flex align-items-baseline" : "d-flex flex-row-reverse align-items-baseline"}>
            <button
              className={props.isShowingEquipment ? "btn dropdown-toggle button-menu-jump me-3" : "btn dropdown-toggle button-menu-jump me-3 hide-dropdown"}
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              Jump to
            </button>
            <button className="btn button-edit">Edit</button>

            <ul className="dropdown-menu">
              {Object.keys(jumpToMenu).map((key, index) => (
                <li key={index} className="btn dropdown-item" onClick={() => scrollToListItem(jumpToMenu[key], document, window)}>{key}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div id="character-view-equipment" className="collapse show">
        {character.equipment?.map((item, index) => (
          <div key={index} id={makeIdFromName(item.name)}>
            <h3><u>{item.name} x{item.amount}</u></h3>
            <p className="description">{item.description}</p>

            <hr />
          </div>
        ))}
      </div>
    </div>
  )
}

Equipment.propTypes = {
  character: PropTypes.object,
  toggleSectionShowing: PropTypes.func,
  isShowingEquipment: PropTypes.bool,
}