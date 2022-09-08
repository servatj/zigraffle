// Dependencies
import React from "react";

// Styled Components
import * as styled from "./styles";

// Types
import { ConnectionStateLabelId, ConnectionStateLabelProps, connectionStateName } from "./types";

const ConnectionStateLabel = ({
  stateId = ConnectionStateLabelId.CONNECTED,
}: ConnectionStateLabelProps) => (
  <styled.Layout stateId={stateId}>{connectionStateName[stateId]}</styled.Layout>
);

export { ConnectionStateLabelId };
// TODO: remove
// @deprecated
export default React.memo(
  ConnectionStateLabel,
  (prevProps, nextProps) => prevProps.stateId === nextProps.stateId,
);
