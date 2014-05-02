---
title: Step By Step Guide for the Zynq
layout: page
---
# Step By Step Guide for the Zynq
To get started using ReconOS, this guide leads you through the
first steps to setup your development environment. You will build
the sort demo and execute it on your board by following the
step by step instructions given. This guide includes the following
steps:

* Setup of the ReconOS Toolchain

* Setup of Linux
  * U-Boot
  * Linux Kernel
  * Root Filesystem

* Setup of ReconOS
  * Linux Module
  * C Library

* Build of the Demo
  * Hardware Project
  * Software Project
  * Running the Demo

## Prerequisites

We assume that you have basic knowledge of the development for
an FPGA, especially for Systems on Chip, and that you have a working
installation of the appropriate tools and your development board.

* Linux workstation with a distribution of your choice, including
  * picocom
  * NFS server
  
* Xilinx ISE Design Tools (Version 14.6 or 14.7 for this guide)
  including the following components
  * Xilinx Platform Studio (XPS)
  * ARM compiler collection
  * Software Development Kit (SDK)
  * Xilinx Microprocessor Debugger (XMD)

* Evaluation board connected to your workstation
  (For this guide the Zedboard Rev. C and D)
  * JTAG connection to program the FPGA
  * UART connection to interact with the board

Furthermore, we need to download some external components. To make
sure that you can follow the steps without any problem, you can use
the following releases:

* Linux Kernel: [http://github.com/Xilinx/linux-xlnx](http://github.com/Xilinx/linux-xlnx)  
  tag: `xilinx-v14.7`

* U-Boot: [http://github.com/Xilinx/u-boot-xlnx](http://github.com/Xilinx/u-boot-xlnx)  
  tag: `xilinx-v14.7`

* U-Boot: Busybox: [http://git.busybox.net/busybox](http://git.busybox.net/busybox)  
  tag: `1_21_1`

## Introduction

The sort demo is an example application to demonstrate ReconOS and its
concepts. It uses both hardware and software threads to sort a bunch of
data. The different threads synchronizes via mboxes and access the data
via the memory subsystem of ReconOS.

## Setup ReconOS
At first you should think about a directory structure you want to use.
As a starting point you can use the following one, we will assume in the
later steps:

```
$HOME/reconos = $WD
  \- reconos       -> the ReconOS repository ($RECONOS)
  \- linux-xlnx    -> the Linux kernel sources
  \- u-boot-xlnx   -> the U-Boot sources
  \- busybox       -> the busybox sources
  \- nfs           -> the root filesystem
```

### Setup the ReconOS toolchain

At first you need to checkout the ReconOS repository:

```
> cd $WD
> git clone https://github.com/reconos/reconos.git
```

To use the ReconOS toolchain you must configure it by changing its configuration
file. Therefore, open `$WD/reconos/tools/environment/zynq_linux.sh` and adjust
it to your actual environment:

|                |                                                                                                                                             |
|----------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| `xil_tools`    | enter the path to your Xilinx tools<br />for example `/opt/Xilinx/14.7`                                                                     |
| `gnutools`     | enter the path to the gnutoolchain you want to use<br />for example `/opt/Xilinx/14.7/ISE_DS/EDK/gnu/arm/lin/bin/arm-xilinx-linux-gnueabi-` |
| `reconos_arch` | no need to change this for this guide                                                                                                       |
| `reconos_os`   | no need to change this for this guide                                                                                                       |
| `reconos_mmu`  | no need to change this for this guide                                                                                                       |
| `KDIR`         | enter the path to the linux kernel<br />in this case: $HOME/reconos/linux-xlnx                                                              |
| `PATH`         | enter directories you want to include to the `PATH` variable<br />in this case: `$HOME/reconos/u-boot-xlnx/tools:$PATH`                     |

After doing the configuration, you can simply source the main setup script by

```
> source $WD/reconos/tools/environment/setup_reconos_toolchain.sh zynq_linux
```

If you do not specify a configuration, the default configuration
tools/environment/default.sh is used, which should be a link to the
linux_zynq.sh configuration file. To change this, perform the following steps:

```
 > cd $WD/reconos/tools/environment
 > ln -sf zynq_linux.sh default.sh
 ```
 
Now you have created your working environment and are able to compile
applications to run on the ARM processor included in the Xilinx Zynq SoC,
use the Xilinx tools and use the ReconOS scripts.

## Setup Linux

ReconOS builds up on an existing operating system, in this case Linux.
Therefore, you have to setup Linux for your Zedboard, as described in the
following steps.

### Compile U-Boot

To boot Linux you need the U-Boot bootloader, you need to configure and build.
Therefore, download the U-Boot sources and change into the directory.

```
> cd $WD
> git clone https://github.com/Xilinx/u-boot-xlnx.git
> cd u-boot-xlnx
```

Then configure the boot mode to download the kernel image via jtag by
opening `$WD/u-boot-xlnx/include/configs/zynq-common.h` and replacing the
following lines

```
"jtagboot=echo TFTPing Linux to RAM... && " \
"tftp 0x3000000 ${kernel_image} && " \
"tftp 0x2A00000 ${devicetree_image} && " \
"tftp 0x2000000 ${ramdisk_image} && " \
"bootm 0x3000000 0x2000000 0x2A00000\0"
```

by

```
"jtagboot=echo Booting Linux from RAM... && " \
"bootm 0x3000000 - 0x2A00000\0"
```

To adjust U-Boot to the configuration of the Zynq Processing System as provided in the
reverence designs of ReconOS, disable the following features
by opening `$WD/u-boot-xlnx/include/configs/zynq_zed.h` and deleting the following lines:

```
#define CONFIG_ZYNQ_QSPI
#define CONFIG_ZYNQ_BOOT_FREEBSD
```

#### Hint for newer versions of U-Boot
Newer versions of U-Boot include a Secondary Program Loader (SPL) to replace the classic
Xilinx First Stage Bootlader. Since we load U-Boot via JTAG directly into the RAM, we do
not need the SPL and should disable it by opening `$WD/u-boot-xlnx/include/configs/zynq-common.h`
and deleting the following line:

```
#define CONFIG_SPL
```

Now you can compile U-Boot by using the make command.

```
> make zynq_zed
```

### Compile Linux

After you have compiled U-Boot you can proceed with Linux.
At first you have to download the Linux sources and change into the
directory.

```
> cd $WD
> git clone https://github.com/Xilinx/linux-xlnx.git
> cd linux-xlnx
```

Then you have to configure the Linux kernel using the default
configuration and compile it. If you wish, you can adjust the
configuration to your needs before compilation.

```
> make xilinx_zynq_defconfig
> make -j8 uImage LOADADDR=0x00008000
```

### Build the root filesystem

To run Linux, we also need a root filesystem to mount. In this section we
will build a minimal root filesystem by compiling busybox. If you
do not want to build the root filesystem by your own, just download
it from the ReconOS homepage and extract it to $WD/nfs.

The first step to create your own root filesystem is to download
the busybox sources. 

```
> cd $WD
> git clone git://git.busybox.net/busybox
> cd busybox
```

To create a minimal busybox setup, we use the provided default
configuration in the stepbystep folder and compile it.

```
> cp $WD/reconos/docs/busybox_config_1_21_1.config .config
> make -j3
> make install
```

Then we can copy the generated files to our root filesystem:

```
> cp -r _install/* $WD/nfs
```

Besides busybox you must create some additional files and folders:

```
> mkdir dev etc etc/init.d lib mnt opt opt/reconos proc root sys tmp

> cat > $WD/nfs/etc/inittab <<'EOF'
::sysinit:/etc/init.d/rcS

# Start an askfirst shell on the serial ports
ttyPS0::respawn:-/bin/sh

# What to do when restarting the init process
::restart:/sbin/init

# What to do before rebooting
::shutdown:/bin/umount -a -r
EOF

> cat > $WD/nfs/etc/init.d/rcS <<'EOF'
#!/bin/sh

echo "Starting rcS..."

echo "++ Mounting filesystem"
mount -t proc none /proc
mount -t sysfs none /sys
mount -t devtmpfs none /dev

echo "rcS Complete"
EOF

> chmod +x $WD/nfs/etc/init.d/rcS
```

### Setup NFS
For the development it has proved advantageous to mount the root filesystem
via NFS.
WARNING: If you develop with other people on the same network make
sure that you do not use the same IP.

To allow the development board to access the root filesystem via NFS you
have to create an export for it and assign an appropriate IP to your
network interface. Eventually you have to replace the `$UID` by your
actual user and group id.

```
> sudo cat >> /etc/exports <<EOF
$HOME/reconos/nfs 192.168.42.2(rw,no_subtree_check,anonuid=$UID,anongid=$UID)
EOF

> sudo ifconfig eth0:1 192.168.42.1 up

> sudo service nfs-kernel-server restart
```

## Compile ReconOS kernel module and setup ReconOS files

ReconOS combines all drivers needed in a single kernel module which needs
to be compiled and copied together with a initialization script to the
root filesystem.

```
> cd $RECONOS/linux/driver
> make

> mkdir -p $WD/nfs/opt/reconos
> cp $RECONOS/linux/driver/mreconos.ko $WD/nfs/opt/reconos
> cp $RECONOS/linux/scripts/reconos_init.sh $WD/nfs/opt/reconos
> chmod +x $WD/nfs/opt/reconos/reconos_init.sh
```

You can then simply initialize the entire ReconOS system by executing
reconos_init.sh on the ARM processor.

## Compile ReconOS library

To compile your applications ReconOS provides all functions in a C library
which must be created.

```
> cd $RECONOS/linux/lib
> make
```

## Compiling the sort demo

To create an EDK project out of your hardware threads, ReconOS provides a setup
script which can be configured through a configuration file. You need
to adjust this configuration file to your actual environment by opening
`$RECONOS/demos/sort_demo/hw/setup_zynq` and adjusting the `base_design`
to your board revision and tool version. Then you can create and
build the entire hardware:

```
> cd $RECONOS/demos/sort_demo/hw
> reconos_setup.sh setup_zynq
> cd edk_zynq_linux
> xps -nw system
xps> run hwclean
xps> run bits
xps> exit
```

To detect the available hardware and its configuration, Linux reads in a device-tree
including all this information. Therefore, you have to make the device-tree available
to the kernel. The device-tree also includes the boot parameters you need to adjust to
your configuration by editing `$RECONOS/demos/sort_demo/hw/edk_zynq_linux/device_tree.dts`
and changing the `bootargs` parameter. For example you must replace `/nfs/zynqn` by
`/home/<your username>/reconos/nfs` and the IP address. Then you can compile the
device-tree into a binary format:

```
> $WD/linux-xlnx/scripts/dtc/dts -I dts -O dtb -o device_tree.dtb device_tree.dts
```

The last step is now to compile the software parts of the sort-demo:

```
> cd $RECONOS/demos/sort_demo/linux
> make
> cp sort_demo $WD/nfs/opt/reconos
```

## Running the sort demo

Now you have setup all relevant parts and can run the demo. At first you
have to setup your Zynq board. Connect JTAG and UART to your PC and
connect both to the same network. To select the right bootmode (jtagboot)
you must set jumpers MI02 to MI06 to GND.

The interaction with the board is established via UART. To see the output
of the boot process, connect to the board:

```
> picocom -b 115200 /dev/ttyACM0
```

Then you can boot Linux and program the FPGA. This `zynq_boot_jtag.sh` script
caches the last used files and uses these if you call `zynq_boot_jtag.sh`
without parameters. So you do not have to specify all arguments again
the next time you use it.

```
> zynq_boot_jtag.sh $WD/linux-xlnx/arch/arm/boot/uImage
                    $RECONOS/demos/sort_demo/hw/edk_zynq_linux/device_tree.dtb
                    $RECONOS/demos/sort_demo/hw/edk_zynq_linux/ps7_init.tcl
                    $WD/u-boot-xlnx/u-boot

> cd $RECONOS/demos/sort_demo/hw/edk_zynq_linux
> reconos_download_bitstream.sh implementation/system.bit
```

Now you should see Linux booting and after some seconds a command prompt should
appear. Now you can use the Linux on the Zedboard just like every other Linux
machine. To run the sort-demo execute the following commands.

```
zynq> cd /opt/reconos
zynq> ./reconos_init.sh
zynq> cd /opt/reconos
zynq> ./sort_demo
zynq> ./sort_demo 4 2 16
```
