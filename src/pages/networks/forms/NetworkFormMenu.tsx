import React, { FC, useEffect, useState } from "react";
import MenuItem from "pages/instances/forms/FormMenuItem";
import { Button } from "@canonical/react-components";
import { updateMaxHeight } from "util/updateMaxHeight";
import useEventListener from "@use-it/event-listener";
import { useNotify } from "context/notify";
import { FormikProps } from "formik/dist/types";
import { NetworkFormValues } from "pages/networks/forms/NetworkForm";

export const NETWORK_DETAILS = "Network details";
export const BRIDGE = "Bridge";
export const DNS = "DNS";
export const IPV4 = "IPv4";
export const IPV6 = "IPv6";
export const YAML_CONFIGURATION = "YAML configuration";

interface Props {
  active: string;
  setActive: (val: string) => void;
  formik: FormikProps<NetworkFormValues>;
}

const NetworkFormMenu: FC<Props> = ({ active, setActive, formik }) => {
  const notify = useNotify();
  const [isConfigOpen, setConfigOpen] = useState(false);
  const menuItemProps = {
    active,
    setActive,
  };

  const hasName = formik.values.name.length > 0;
  const hasOvnTypeMissingUplink =
    formik.values.type === "ovn" && (formik.values.network?.length ?? 0) < 1;
  const disableReason = hasName
    ? hasOvnTypeMissingUplink
      ? "Please select an uplink network"
      : undefined
    : "Please enter a network name to enable this section";

  const resize = () => {
    updateMaxHeight("form-navigation", "p-bottom-controls");
  };
  useEffect(resize, [notify.notification?.message]);
  useEventListener("resize", resize);
  return (
    <div className="p-side-navigation--accordion form-navigation">
      <nav aria-label="Network form navigation">
        <ul className="p-side-navigation__list">
          <MenuItem label={NETWORK_DETAILS} {...menuItemProps} />
          <li className="p-side-navigation__item">
            <Button
              type="button"
              className="p-side-navigation__accordion-button"
              aria-expanded={isConfigOpen ? "true" : "false"}
              onClick={() => setConfigOpen(!isConfigOpen)}
              disabled={Boolean(disableReason)}
              title={disableReason}
            >
              Configuration options
            </Button>

            <ul
              className="p-side-navigation__list"
              aria-expanded={isConfigOpen ? "true" : "false"}
            >
              <MenuItem
                label={BRIDGE}
                {...menuItemProps}
                disableReason={disableReason}
              />
              <MenuItem
                label={DNS}
                {...menuItemProps}
                disableReason={disableReason}
              />
              {formik.values.ipv4_address !== "none" && (
                <MenuItem
                  label={IPV4}
                  {...menuItemProps}
                  disableReason={disableReason}
                />
              )}
              {formik.values.ipv6_address !== "none" && (
                <MenuItem
                  label={IPV6}
                  {...menuItemProps}
                  disableReason={disableReason}
                />
              )}
            </ul>
          </li>
          <MenuItem
            label={YAML_CONFIGURATION}
            {...menuItemProps}
            disableReason={disableReason}
          />
        </ul>
      </nav>
    </div>
  );
};

export default NetworkFormMenu;