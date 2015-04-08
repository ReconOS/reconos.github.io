---
title: Step By Step Guide for the Zynq
layout: page
---
# Step By Step Guide for the Zynq
To get started using ReconOS, this guide leads you through the first steps to
setup your development environment. You will build the sort demo and execute
it on your board by following the step by step instructions given. The sort
demo is an example application to demonstrate ReconOS and its concepts. It
uses both hardware and software threads to sort a bunch of data. The different
threads synchronizes via mboxes and access the data via the memory subsystem
of ReconOS. This guide includes the following steps:

* Prerequisites

* Linux
  * U-Boot
  * Linux Kernel
  * Root Filesystem

* SortDemo
  * Hardware Project
  * Software Project
  * Running the Demo


## Prerequisites

We assume that you have basic knowledge of the development for
an FPGA, especially for Systems on Chip, and that you have a working
installation of the appropriate tools and your development board:

* Linux workstation with a distribution of your choice, including
  * picocom
  * NFS server
  * Python 3.4 or greater
  
* Xilinx ISE Design Tools (Version 14.7 for this guide)
  including the following components and licenses
  * Xilinx Platform Studio (XPS)
  * ARM compiler collection
  * Software Development Kit (SDK)
  * Xilinx Microprocessor Debugger (XMD)

* Evaluation board connected to your workstation
  (For this guide the Zedboard Rev. C or D)
  * JTAG connection to program the FPGA
  * UART connection to interact with the board

Furthermore, we need to download some external components. To make
sure that you can follow the steps without any problem, you can use
the following releases:

* Linux Kernel: [https://github.com/xilinx/linux-xlnx](https://github.com/xilinx/linux-xlnx)

* U-Boot: [https://github.com/xilinx/u-boot-xlnx](https://github.com/xilinx/u-boot-xlnx)

* Busybox: [git://git.busybox.net/busybox](git://git.busybox.net/busybox)

* Xilinx Embedded Software Sources: [https://github.com/xilinx/embeddedsw](https://github.com/xilinx/embeddedsw)

### Setup Working Directory

At first you should clone all the repositories listed above and create a
folder for the root filesystem. `$WD` represents your working directory.

```
> cd $WD
> git clone https://github.com/reconos/reconos
> git clone https://github.com/xilinx/linux-xlnx
> git clone https://github.com/xilinx/u-boot-xlnx
> git clone git://git.busybox.net/busybox
> git clone https://github.com/xilinx/embeddedsw
> mkdir nfs
```

This should result in the following directory structure:

```
$WD
  \- reconos       -> the ReconOS repository ($RECONOS)
  \- linux-xlnx    -> the Linux kernel sources
  \- u-boot-xlnx   -> the U-Boot sources
  \- busybox       -> the busybox sources
  \- embeddedsw    -> the Xilinx Embedded Software sources
  \- nfs           -> the root filesystem
```

## Linux

ReconOS builds up on an existing operating system, in this case Linux. In this
section you will setup Linux on an SD card mounting the root filesystem via
NFS. This allows to simply reboot the entire board by turning it off and on
again and gives you the flexibility to exchange files via network easily.

The Zynq boot process consists out of several stages. At first the internal
boot ROM is loaded and executes the First Stage Boot Loader (FSBL) from a non-
volatile memory, dependent on the jumper configuration. The FSBL initializes
the hardware based on the configuration of the user and executes the U-Boot
bootloader, which finally boots Linux. Initially, the FSBL was provided by
Xilinx as proprietary software, but recently, U-Boot introduced an open source
alternative called Secondary Program Loader (SPL). Although not officially
supported by Xilinx, we will use this SPL in this tutorial.

Compiling Linux and U-Boot requires some environment variables to be set to
specify the target architecture and the appropriate cross compiler. Therefore,
export the following variables, adjusted to your actual setup:

```
export ARCH=arm
export CROSS_COMPILE=/opt/Xilinx/SDK/2014.4/gnu/arm/lin/bin/arm-xilinx-linux-gnueabi-
export KDIR=$WD/linux-xlnx/y
export PATH=$WD/u-boot-xlnx/tools/:$PATH
export PATH=$WD/linux-xlnx/scripts/dtc:$PATH
```

### Compile U-Boot

At first you need to copy the hardware initialization files for the Zedboard
into the U-Boot sources. The `ps7_init` files contain initialization code to
setup the configurable hardware of the processing system. Although U-Boot
compiles fine without these sources, it will not run in the end. Basic
initialization files are provided in the Embedded Software repository.

```
> cd $WD/u-boot-xlnx
> cp ../embeddedsw/lib/sw_apps/zynq_fsbl/misc/zed/ps7_init_gpl.* board/xilinx/zynq/
```

The SPL itself is also capable of booting Linux directly but requires non-
volatile memory to store the kernel parameters. Therefore, we will not use
this feature and execute a full blown U-Boot instance, which loads the kernel
image and device tree and boots the kernel. Therefore, we need to disable the
direct boot feature by applying the following diff:

```
--- a/include/configs/zynq-common.h
+++ b/include/configs/zynq-common.h
@@ -477,7 +477,7 @@
 /* FPGA support */
 #define CONFIG_SPL_FPGA_SUPPORT
 #define CONFIG_SPL_FPGA_LOAD_ADDR      0x1000000
-/* #define CONFIG_SPL_FPGA_BIT */
+#define CONFIG_SPL_FPGA_BIT
 #ifdef CONFIG_SPL_FPGA_BIT
 # define CONFIG_SPL_FPGA_LOAD_ARGS_NAME "download.bit"
 #else
@@ -530,10 +530,6 @@
 #define CONFIG_SPL_ETH_DEVICE "Gem.e000b000"
 #endif
 
-/* for booting directly linux */
-#define CONFIG_SPL_OS_BOOT
-#define CONFIG_SYS_SPI_KERNEL_OFFS     0 /* FIXME */
-
 /* SP location before relocation, must use scratch RAM */
 #define CONFIG_SPL_TEXT_BASE   0x0

```

Now you can configure and compile U-Boot by using the make command:

```
> make zynq_zed_config
> make -j3
```

### Compile Linux

After you have compiled U-Boot you can proceed with Linux. Therefore,
configure the Linux kernel using the default configuration and compile it. If
you wish, you can adjust the configuration to your needs before compilation.

```
> make xilinx_zynq_defconfig
> make -j3 uImage LOADADDR=0x00008000
```

Additionally, Linux needs a device tree describing the underlying hardware.
The device tree also includes the kernel parameters passed during the boot
process. You need to adjust these parameters to fit our configuration.
Therefore, adjust the bootargs in `$WD/linux-xlnx/arch/arm/boot/dts/zynq-
zed.dts` to match the following. Of course, you need to adjust `<<serverip>>`,
`<<path>>` and `<<boardip>>` to fit your configuration.

```
bootargs = "console=ttyPS0,115200 root=/dev/nfs rw nfsroot=<<serverip>>:<<path>>,tcp,nfsvers=3 ip=<<boardip>>:::255.255.255.0:reconos:eth0:off earlyprintk";

```

### Build the root filesystem

To run Linux, we also need a root filesystem to mount. In this section we
will build a minimal root filesystem by compiling busybox. If you
do not want to build the root filesystem by your own, just download
it from the ReconOS homepage and extract it to $WD/nfs.

To create a minimal busybox setup, create a minimal config and enable all
features you like. After that, compile busybox and copy the generated files to
the root filesystem.

```
> cd $WD/busybox
> make allnoconfig
> make menuconfig
> make -j3
> make install
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
As already mentioned, the root filesystem will be mounted via NFS. To allow
the development board to access the root filesystem, you have to create an
export for it by adding the following line to your `/etc/exports` file.
Replace `<<path>>`, `<<boardip>>`, `<<uid>>` and `<<gid>>` by the appropriate values.

```
<<path> <<boardip>>(rw,no_subtree_check,anonuid=<<uid>>,anongid=<<gid>>)
```

Of course, you need to make sure to configure both the board and your
workstation properly to allow communication via network. This includes the
right ip addresses and a physical connection.

### Compile ReconOS kernel module

ReconOS combines drivers in a kernel module which needs to be compiled and
copied together with a initialization script to the root filesystem.

```
> cd $WD/reconos/linux/driver
> make

> mkdir -p $WD/nfs/opt/reconos
> cp $WD/reconos/linux/driver/mreconos.ko $WD/nfs/opt/reconos
> cp $WD/reconos/linux/scripts/reconos_init.sh $WD/nfs/opt/reconos
> chmod +x $WD/nfs/opt/reconos/reconos_init.sh
```

You can then simply initialize the entire ReconOS system by executing
reconos_init.sh on the ARM processor.

## Sort Demo

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
> $WD/linux-xlnx/scripts/dtc/dtc -I dts -O dtb -o device_tree.dtb device_tree.dts
```

The last step is now to compile the software parts of the sort-demo:

```
> cd $RECONOS/demos/sort_demo/linux
> make
> cp sort_demo $WD/nfs/opt/reconos
```

### Running the Demo

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
