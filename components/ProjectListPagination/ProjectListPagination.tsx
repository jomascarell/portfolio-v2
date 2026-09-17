import styles from './ProjectListPagination.module.css'

/* The project deck's position indicator: one dot per project, the centred
 * one filled. Figma: ProjectListPagination (1073:2503), built from
 * ProjectListDot, State = default | active (1073:2708).
 *
 * WHAT IT IS FOR. The carousel loops seven copies of the projects past a
 * fixed centre, so it has no scrollbar and no ends — nothing in the list
 * itself says how many projects there are or which one you are on. The rows
 * answer the second question (the centred one is lit) and nothing answers
 * the first. This does both, in 4px.
 *
 * IT DOES NOT MOVE. There is no travelling thumb and no transform: the dots
 * are static and the state is carried entirely by which one is filled.
 * Checked against gabrielbeaugonin.com, which the designer named as the
 * reference — four static dots, one colour, opacity 0.32 for the inactive
 * ones and 1 for the active one, no transform anywhere. We take that
 * behaviour and Figma's two colours (below) rather than its opacity trick.
 *
 * PRESENTATIONAL ON PURPOSE. It holds no state and knows nothing about the
 * carousel — `active` is a plain index handed down by ProjectList, which
 * already tracks it for the rows. Keeping the arithmetic there and the
 * drawing here is what lets this file match the Figma component one to one.
 *
 * aria-hidden BECAUSE THE ROWS ALREADY SAY IT. The centred project is
 * announced by its own lit row; exposing the dots too would state the
 * current project twice with no way to act on either. That makes this
 * decoration, which is also why the inactive dots are allowed to sit at
 * color/text/subtle — around 1.3:1 on the page ground, far below the 3:1
 * that a NON-decorative indicator would owe. The lit row is the real
 * signal; this is the diagram of it. */

type ProjectListPaginationProps = {
  /* How many dots. Passed in rather than read from lib/projects so the
     component stays drawable in isolation — the gallery renders specimens
     of every component with made-up values. */
  count: number
  /* Zero-based index of the filled dot. Out-of-range simply fills nothing,
     which is the correct drawing for "no project centred" and not a state
     worth throwing over. */
  active: number
  className?: string
}

export default function ProjectListPagination({
  count,
  active,
  className,
}: ProjectListPaginationProps) {
  return (
    <div
      className={[styles.rail, className].filter(Boolean).join(' ')}
      aria-hidden="true"
    >
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={styles.dot}
          data-state={index === active ? 'active' : undefined}
        />
      ))}
    </div>
  )
}
