// @flow
import React from 'react';
import classnames from 'classnames';
import { isEqual } from 'lodash';
import { Flipped } from 'react-flip-toolkit';

import type { Lesson } from 'types/modules';
import type { HoverLesson } from 'types/timetables';

import {
  formatWeekNumber,
  getHoverLesson,
  getLessonKey,
  LESSON_TYPE_ABBREV,
} from 'utils/timetables';
import elements from 'views/elements';

import styles from './TimetableCell.scss';

type Props = {
  showTitle: boolean,
  lesson: Lesson,
  style?: Object,
  onClick?: Function,
  onHover: ?(?HoverLesson) => void,
  hoverLesson: ?HoverLesson,
  flipProps?: Object,
};

/**
 * Smallest unit in timetable.
 * Representing a lesson in this case. In future we
 * might explore other representations e.g. grouped lessons
 */
function TimetableCell(props: Props) {
  const { lesson, showTitle, onClick, onHover, hoverLesson, flipProps } = props;

  const moduleName = showTitle ? `${lesson.ModuleCode} ${lesson.ModuleTitle}` : lesson.ModuleCode;
  const conditionalProps = { onClick };

  const Cell = props.onClick ? 'button' : 'div';
  const hover = isEqual(getHoverLesson(lesson), hoverLesson);
  const flipId = getLessonKey(lesson);

  /* eslint-disable */
  return (
    <Flipped flipId={flipId}>
      <Cell // $FlowFixMe
        className={classnames(styles.cell, elements.lessons, `color-${lesson.colorIndex}`, {
          hoverable: !!props.onClick,
          [styles.clickable]: !!onClick,
          // $FlowFixMe
          [styles.available]: lesson.isAvailable,
          // $FlowFixMe
          [styles.active]: lesson.isActive,
          // Local hover style for the timetable planner timetable,
          [styles.hover]: hover,
          // Global hover style for module page timetable
          hover,
        })}
        style={props.style}
        onMouseEnter={() => onHover?.(getHoverLesson(lesson))}
        onTouchStart={() => onHover?.(getHoverLesson(lesson))}
        onMouseLeave={() => onHover?.(null)}
        onTouchEnd={() => onHover?.(null)}
        {...conditionalProps}
        {...flipProps}
      >
        <Flipped inverseFlipId={flipId} scale>
          <div className={styles.cellContainer}>
            <div className={styles.moduleName}>{moduleName}</div>
            <div>
              {LESSON_TYPE_ABBREV[lesson.LessonType]} [{lesson.ClassNo}]
            </div>
            <div>{lesson.Venue}</div>
            {lesson.WeekText !== 'Every Week' && <div>{formatWeekNumber(lesson.WeekText)}</div>}
          </div>
        </Flipped>
      </Cell>
    </Flipped>
  );
}

export default TimetableCell;
