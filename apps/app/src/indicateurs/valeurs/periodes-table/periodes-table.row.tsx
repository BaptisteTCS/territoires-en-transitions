import { appLabels } from '@/app/labels/catalog';
import {
  IndicateurPeriodes,
  type IndicateurPeriode,
} from '@tet/domain/indicateurs';
import { TableCell } from '@tet/ui';
import { IndicateurValeursCombinedCell } from '../grid/indicateur-valeurs-combined.cell';
import { ADD_PERIODE_CELL_CLASSNAME } from './periodes-table.styles';
import type { PeriodeTableRow } from './periodes-table.types';

type Props = {
  row: PeriodeTableRow;
  periodes: readonly IndicateurPeriode[];
  showAddPeriodeColumn: boolean;
};

export const PeriodesTableRow = ({
  row,
  periodes,
  showAddPeriodeColumn,
}: Props) => (
  <tr>
    {row.title}
    {periodes.map((periode) => {
      const key = IndicateurPeriodes.key(periode);
      const { resultat, objectif, isReadonly, emptyLabel, dataSource } =
        row.cellOf(periode);
      return (
        <TableCell
          key={key}
          className="border-b border-r border-primary-4 !px-2"
          data-periode={periode.dateDebut}
          data-periodicite={periode.periodicite}
          data-source={dataSource}
        >
          <IndicateurValeursCombinedCell
            periodeLabel={IndicateurPeriodes.format(periode)}
            resultat={resultat}
            objectif={objectif}
            readonly={isReadonly}
            emptyLabel={emptyLabel}
            isFuture={IndicateurPeriodes.isFuture(periode)}
            onSave={(field, value) => row.onSave(periode, field, value)}
          />
        </TableCell>
      );
    })}
    {showAddPeriodeColumn && (
      <TableCell
        className={`${ADD_PERIODE_CELL_CLASSNAME} border-b border-primary-4`}
      />
    )}
  </tr>
);
