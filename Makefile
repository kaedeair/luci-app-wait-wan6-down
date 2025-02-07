# Copyright (C) 2025 kaedeair <kaedeair@outlook.com>
#
# This is free software, licensed under the MIT.
#

include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-wait-wan6-down
PKG_VERSION:=1.0
PKG_RELEASE:=1
PKG_MAINTAINER:=kaedeair <kaedeair@outlook.com>

LUCI_TITLE:=A Luci application that uses script to wait for wan6 down when ppp lcp terminated
LUCI_DEPENDS:= +luci-base +odhcp6c +ppp +netifd
LUCI_PKGARCH:=all
LUCI_MAINTAINER:= $(PKG_MAINTAINER)
LUCI_URL:=https://github.com/kaedeair/luci-app-wait-wan6-down.git

PKG_LICENSE:=MIT
PKG_LICENSE_FILES:=LICENSE

define Package/$(PKG_NAME)/postrm
#!/bin/sh
rm -rf /usr/share/wait-wan6-down/ >/dev/null 2>&1
rm -f /etc/ppp/ip-down.d/check_wan6_down.sh >/dev/null 2>&1
endef



include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature

