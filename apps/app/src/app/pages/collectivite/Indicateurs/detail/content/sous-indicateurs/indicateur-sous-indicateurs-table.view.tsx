'use client';

import { PeriodesTable } from '@/app/indicateurs/valeurs/periodes-table/periodes-table';
import type { SaveSousIndicateurValeur } from '@/app/indicateurs/sous-indicateurs/data/use-save-sous-indicateur-valeur';
import type { DeclareIndicateursPeriodes } from '@/app/indicateurs/valeurs/use-declare-indicateur-periodes';
import type { SousIndicateursTableData } from '@/app/indicateurs/sous-indicateurs/sous-indicateurs-table.rules';
import { appLabels } from '@/app/labels/catalog';
import SpinnerLoader from '@/app/ui/shared/SpinnerLoader';
import type { IndicateurPeriodicite } from '@tet/domain/indicateurs';
import { uniq } from 'es-toolkit';
import { useRef, type JSX, type PropsWithChildren } from 'react';
import { useIndicateurPeriodeDeclaration } from '../../../table/use-indicateur-periode-declaration';
import { useRevealIndicateurPeriode } from '../../../table/use-reveal-indicateur-periode';
import { useIndicateurSousIndicateursTable } from '../../context/indicateur-sous-indicateurs-table.context';
import { toSousIndicateurTable } from './to-sous-indicateur-table-rows';
import { useSousIndicateurRowsExpansion } from './use-sous-indicateur-rows-expansion';

type Props = {
  indicateurId: number;
  titre: string;
  unite: string;
  periodicite: IndicateurPeriodicite;
  isReadonly: boolean;
};

type ReadyTableProps = Omit<Props, 'indicateurId'> & {
  collectiviteId: number;
  saveValeur: SaveSousIndicateurValeur;
  declarePeriodes: DeclareIndicateursPeriodes;
  data: SousIndicateursTableData;
};

const StatusMessage = ({
  role,
  children,
}: PropsWithChildren<{ role?: 'alert' }>): JSX.Element => (
  <p role={role} className="text-center text-sm text-grey-7">
    {children}
  </p>
);

const LoadingState = (): JSX.Element => (
  <div role="status" className="my-8 flex justify-center">
    <SpinnerLoader className="mx-auto" />
    <span className="sr-only">
      {appLabels.indicateurSousIndicateursChargement}
    </span>
  </div>
);

const ReadyTable = ({
  titre,
  unite,
  periodicite,
  isReadonly,
  collectiviteId,
  saveValeur,
  declarePeriodes,
  data,
}: ReadyTableProps): JSX.Element => {
  const { visibleRows, isExpanded, toggle } = useSousIndicateurRowsExpansion(
    data.rows
  );
  const { periodes, rows } = toSousIndicateurTable({
    data,
    visibleRows,
    periodicite,
    collectiviteId,
    isReadonly,
    saveValeur,
    isExpanded,
    onToggle: toggle,
  });

  const leafIndicateurIds = uniq(
    data.rows.filter((row) => !row.isExpandable).map((row) => row.indicateurId)
  );
  const declaration = useIndicateurPeriodeDeclaration({
    canWrite: !isReadonly,
    periodicite,
    existingPeriodes: periodes,
    declarePeriode: (periode) => declarePeriodes(leafIndicateurIds, [periode]),
    declarePeriodes: (newPeriodes) =>
      declarePeriodes(leafIndicateurIds, newPeriodes),
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  useRevealIndicateurPeriode(scrollRef, declaration.periodeToReveal, periodes);

  return (
    <>
      <PeriodesTable
        title={titre}
        label={appLabels.indicateurSousIndicateursValeurs}
        unite={unite}
        periodes={periodes}
        rows={rows}
        readonly={isReadonly}
        isTitlePinned
        addPeriode={declaration.addPeriode}
        scrollRef={scrollRef}
      />
      {declaration.modal}
    </>
  );
};

export const IndicateurSousIndicateursTable = ({
  indicateurId,
  titre,
  unite,
  periodicite,
  isReadonly,
}: Props): JSX.Element => {
  const {
    useSousIndicateursTable,
    useSaveSousIndicateurValeur,
    useDeclareSousIndicateursPeriodes,
  } = useIndicateurSousIndicateursTable();
  const state = useSousIndicateursTable(indicateurId);
  const saveValeur = useSaveSousIndicateurValeur();
  const declarePeriodes = useDeclareSousIndicateursPeriodes();

  if (state.status === 'loading') {
    return <LoadingState />;
  }
  if (state.status === 'error') {
    return (
      <StatusMessage role="alert">
        {appLabels.indicateurSousIndicateursErreur}
      </StatusMessage>
    );
  }
  if (state.data.rows.length === 0) {
    return <StatusMessage>{appLabels.aucuneDonneeDisponible}</StatusMessage>;
  }

  return (
    <ReadyTable
      titre={titre}
      unite={unite}
      periodicite={periodicite}
      isReadonly={isReadonly}
      collectiviteId={state.collectiviteId}
      saveValeur={saveValeur}
      declarePeriodes={declarePeriodes}
      data={state.data}
    />
  );
};
