import "./style.css";
import PropTypes from "prop-types";
import Alert from "../../Alert";
import { Modal } from "bootstrap/dist/js/bootstrap.min.js";
import { Character } from "../../../models/Character";
import { calcPassivePerception, calcProficiencyBonus, calcScoreMod, getScoreName } from "../../../utils/shared-functions";
import { useEffect, useState } from "react";
import { useMutation } from "@apollo/client";
import { UPDATE_CHARACTER } from "../../../utils/mutations";
import { SECTION_TITLE_NAME } from "../../../utils/enums";

export default function CharacterInfo({ char, toggleSectionShowing, isShowingInfo, toggleEditing, isEditing }) {
  let character = new Character(char);

  const [updateCharacter] = useMutation(UPDATE_CHARACTER);

  const [modalAlert, setModalAlert] = useState(null);
  const [alertTitle, setAlertTitle] = useState("");

  const [level, setLevel] = useState(character.level);
  const [armor, setArmor] = useState(character.armor);
  const [speed, setSpeed] = useState(character.speed);
  const [hp, setHp] = useState(character.hp);
  const [deathSaves, setDeathSaves] = useState(character.deathSaves);
  const [inspiration, setInspiration] = useState(character.inspiration);

  const onChangeLevel = ({ target }) => {
    setLevel(Number(target.value));

    // Update the current hit die if greater than the level. This accounts for human error
    if (hp.dieAmountCurrent > target.value) setHp({ ...hp, dieAmountCurrent: Number(target.value) });
  }
  const onChangeArmor = ({ target }) => setArmor(Number(target.value));
  const onChangeSpeed = ({ target }) => setSpeed(Number(target.value));
  const onChangeHpCurrent = ({ target }) => setHp({ ...hp, current: Number(target.value) });
  const onChangeHpMax = ({ target }) => setHp({ ...hp, max: Number(target.value) });
  const onChangeHpTemp = ({ target }) => setHp({ ...hp, temp: Number(target.value) });
  const onChangeHpDieAmountCurrent = ({ target }) => setHp({ ...hp, dieAmountCurrent: Number(target.value) });
  const onChangeDeathFailure = ({ target }) => setDeathSaves({ ...deathSaves, failures: Number(target.value) });
  const onChangeDeathSuccess = ({ target }) => setDeathSaves({ ...deathSaves, successes: Number(target.value) });
  const onChangeInspriation = ({ target }) => setInspiration(Number(target.value));

  useEffect(() => {
    // Initiate modal
    const modalError = document.querySelector(".alert-modal-update").querySelector("#alertModal");
    setModalAlert(new Modal(modalError));
  }, []);

  /**
   * Save all the updated information, then save it to the db.
   */
  const onClickUpdateCharacter = async () => {
    character.level = level;
    character.armor = armor;
    character.speed = speed;
    character.hp = hp;
    character.deathSaves = deathSaves
    character.inspiration = inspiration;

    try {
      const { data } = await updateCharacter({
        variables: {
          _id: character._id,
          character
        }
      });

      if (!data?.updateCharacter) {
        console.log("didn't update character but didn't throw");
        setAlertTitle(`Couldn't update ${SECTION_TITLE_NAME.CHARACTER_INFO}`);
        modalAlert.toggle();
        return;
      }

      setAlertTitle(`Updated ${SECTION_TITLE_NAME.CHARACTER_INFO} for ${character.name}`);
      modalAlert.toggle();
      toggleEditing();

    } catch (error) {
      console.log("@error Couldn't update character");
      console.error(error);
      setAlertTitle(`Couldn't update ${SECTION_TITLE_NAME.CHARACTER_INFO}`);
      modalAlert.toggle();
    }
  }

  const renderEditing = () => {
    return (
      <>
        <div className="stat-row">
          <p>Level</p>
          <input className="edit-input" value={level} onChange={onChangeLevel} />
        </div>
        <div className="stat-row">
          <p>Armor Class</p>
          <input className="edit-input" value={armor} onChange={onChangeArmor} />
        </div>
        <div className="stat-row">
          <p>Initiative</p>
          <input className="edit-input" value={calcScoreMod(character.scores.dex, true)} disabled />
        </div>
        <div className="stat-row">
          <p>Speed (ft.)</p>
          <input className="edit-input" value={speed} onChange={onChangeSpeed} />
        </div>
        <div className="stat-row">
          <p>Current HP</p>
          <div>
            <input className="edit-input" value={hp.current} onChange={onChangeHpCurrent} />
            <label className="px-2">/</label>
            <input className="edit-input" value={hp.max} onChange={onChangeHpMax} />
          </div>
        </div>
        <div className="stat-row">
          <p>Temp HP</p>
          <input className="edit-input" value={hp.temp} onChange={onChangeHpTemp} />
        </div>
        <div className="stat-row">
          <p>HP Die Type</p>
          <input className="edit-input" value={character.hp.dieType} disabled />
        </div>
        <div className="stat-row">
          <p>HP Die Count</p>
          <div>
            <select value={hp.dieAmountCurrent} onChange={onChangeHpDieAmountCurrent} >
              {Array.from({ length: level + 1 }, (_, index) => (
                <option key={index}>{index}</option>
              ))}
            </select>
            <b>/{level}</b>
          </div>
        </div>
        <div className="stat-row">
          <p>Death Save Successes</p>
          <div>
            <select value={deathSaves.successes} onChange={onChangeDeathSuccess}>
              {Array.from({ length: 4 }, (_, index) => (
                <option key={index}>{index}</option>
              ))}
            </select>
            <b>/3</b>
          </div>
        </div>
        <div className="stat-row">
          <p>Death Save Failures</p>
          <div>
            <select value={deathSaves.failures} onChange={onChangeDeathFailure}>
              {Array.from({ length: 4 }, (_, index) => (
                <option key={index}>{index}</option>
              ))}
            </select>
            <b>/3</b>
          </div>
        </div>
        <div className="stat-row">
          <p>Proficiency Bonus</p>
          <input className="edit-input" value={calcProficiencyBonus(level, true)} disabled />
        </div>
        <div className="stat-row">
          <p>Passive Perception</p>
          <input className="edit-input" value={calcPassivePerception(character.scores.wis, level, character.skills.perception, true)} disabled />
        </div>
        <div className="stat-row">
          <p>Spell Casting Stat</p>
          <b className="pt-2">{getScoreName(character.spellCastStat, true)}</b>
        </div>
        <div className="stat-row">
          <p>Inspiration</p>
          <input className="edit-input" value={inspiration} onChange={onChangeInspriation} />
        </div>
        <button type="button" className="btn fs-3 button-update" onClick={() => onClickUpdateCharacter()}>Update {SECTION_TITLE_NAME.CHARACTER_INFO}</button>
      </>
    )
  }

  const renderViewing = () => {
    return (
      <>
        <div className="stat-row">
          <p>Level</p>
          <b>{level}</b>
        </div>
        <div className="stat-row">
          <p>Armor Class</p>
          <b>{armor}</b>
        </div>
        <div className="stat-row">
          <p>Initiative</p>
          <b>{calcScoreMod(character.scores.dex, true)}</b>
        </div>
        <div className="stat-row">
          <p>Speed (ft.)</p>
          <b>{speed}</b>
        </div>
        <div className="stat-row">
          <p>Current HP</p>
          <b>{hp.current}/{hp.max}</b>
        </div>
        <div className="stat-row">
          <p>Temp HP</p>
          <b>{hp.temp}</b>
        </div>
        <div className="stat-row">
          <p>HP Die Type</p>
          <b>{character.hp.dieType}</b>
        </div>
        <div className="stat-row">
          <p>HP Die Count</p>
          <b>{hp.dieAmountCurrent}/{level}</b>
        </div>
        <div className="stat-row">
          <p>Death Save Successes</p>
          <b>{deathSaves.successes}/3</b>
        </div>
        <div className="stat-row">
          <p>Death Save Failures</p>
          <b>{deathSaves.failures}/3</b>
        </div>
        <div className="stat-row">
          <p>Proficiency Bonus</p>
          <b>{calcProficiencyBonus(character.level, true)}</b>
        </div>
        <div className="stat-row">
          <p>Passive Perception</p>
          <b>{calcPassivePerception(character.scores.wis, character.level, character.skills.perception, true)}</b>
        </div>
        <div className="stat-row">
          <p>Spell Casting Stat</p>
          <b>{getScoreName(character.spellCastStat, true)}</b>
        </div>
        <div className="stat-row">
          <p>Inspiration</p>
          <b>{inspiration}</b>
        </div>
      </>
    )
  }

  return (
    <div className="fs-3">
      <div className="character-view-header sticky-top pt-1">
        <div className="d-flex" role="button" onClick={() => toggleSectionShowing()} data-bs-toggle="collapse" data-bs-target="#character-view-info" aria-expanded="false" aria-controls="character-view-info">
          <h2 className="section-title">
            {SECTION_TITLE_NAME.CHARACTER_INFO}
          </h2>
          {isShowingInfo ?
            <i className="bi bi-chevron-down fs-3 px-3" aria-label="chevron-down"></i> :
            <i className="bi bi-chevron-up fs-3 px-3" aria-label="chevron-up"></i>
          }
        </div>

        <button className="btn btn-secondary button-edit" onClick={() => toggleEditing()}>{isEditing ? "Finish" : "Edit"}</button>
      </div>

      <div id="character-view-info" className="collapse show">
        {isEditing ?
          renderEditing() :
          renderViewing()
        }
      </div>

      <div className="alert-modal-update">
        <Alert title={alertTitle} />
      </div>

    </div>
  )
}

CharacterInfo.propTypes = {
  char: PropTypes.object,
  toggleSectionShowing: PropTypes.func,
  isShowingInfo: PropTypes.bool,
  toggleEditing: PropTypes.func,
  isEditing: PropTypes.bool,
}