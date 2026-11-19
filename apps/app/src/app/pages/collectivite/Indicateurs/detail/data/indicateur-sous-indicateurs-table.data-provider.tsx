'use client';

import { useDeclareSousIndicateursPeriodes } from '@/app/indicateurs/sous-indicateurs/data/use-declare-sous-indicateurs-periodes';
import { useSaveSousIndicateurValeur } from '@/app/indicateurs/sous-indicateurs/data/use-save-sous-indicateur-valeur';
import { useSousIndicateursTable } from '@/app/indicateurs/sous-indicateurs/data/use-sous-indicateurs-table';
import type { JSX, PropsWithChildren } from 'react';
import {
  IndicateurSousIndicateursTableProvider,
  type IndicateurSousIndicateursTableValue,
} from '../context/indicateur-sous-indicateurs-table.context';

const SOUS_INDICATEURS_TABLE_VALUE: IndicateurSousIndicateursTableValue = {
  useSousIndicateursTable,
  useSaveSousIndicateurValeur,
  useDeclareSousIndicateursPeriodes,
};

export const IndicateurSousIndicateursTableDataProvider = ({
  children,
}: PropsWithChildren): JSX.Element => (
  <IndicateurSousIndicateursTableProvider value={SOUS_INDICATEURS_TABLE_VALUE}>
    {children}
  </IndicateurSousIndicateursTableProvider>
);
