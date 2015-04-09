---
title: Step By Step Guide for the Zynq
layout: page
---
# Step By Step Guide for the Zynq
To get started using ReconOS, this guide leads you through the first steps to
setup your development environment. You will build the sort demo and execute
it on your board by following the step by step instructions given. The
SortDemo is an example application to demonstrate ReconOS and its concepts. It
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
export KDIR=$WD/linux-xlnx/
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

Now you can compile Linux by the following make command:

```
> make -j3 uImage LOADADDR=0x00008000
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
> make RECONOS_ARCH=zynq RECONOS_OS=linux RECONOS_MMU=true PREFIX=$WD/nfs/opt/reconos install
```

You can then simply initialize the entire ReconOS system by executing
`reconos_init.sh` on the ARM processor.

## Sort Demo

Until now, we have configured and installed a basic setup of our working
environment and now we are going to get in touch with the very first ReconOS
application, the well known SortDemo. You will see the toolflow of the ReconOS
Development Kit (RDK) and how to implement an entire application. To get
started with the RDK, the only thing you have to do is to source the settings
file under `$WD/reconos/setting.sh`. After that, you can simply type `rdk` to
start the development kit.

```
> cd $WD/reconos
> source tools/settings.sh
```

So let's take a look into the SortDemo project folder in
`$WD/reconos/demos/sort_demo`. It consists out of a source folder and a
project file describing the structure of the application. Out of these
sources, the RDK generates a complete EDK project for the hardware design and
a ready to compile software project. To generate these two projects, simply
start the RDK and execute `export_hw` and `export_sw`. To get more information
for each command, you can execute it with the `--help` option and double tab
reveals a list of all available commands.

```
> cd $WD/reconos/demos/sort_demo
> rdk
ReconOS Toolchain> export_hw
ReconOS Toolchain> export_sw
ReconOS Toolchain> exit
```

Now, the RDK has created two new folders, `build.hw` and `build.sw`, which
contain the projects for hardware and software, respectively. To build both of
them, we again need to setup some environment variable and compile an
additional library. Again, the `CROSS_COMPILER` environment variable specifies
the compiler for the ARM processor used for the software compilation. The time
library is used by the SortDemo to get precise benchmarking results.

```
> export CROSS_COMPILE=/opt/Xilinx/SDK/2014.4/gnu/arm/lin/bin/arm-xilinx-linux-gnueabi-
> cd $WD/reconos/linux/tools/timer
> make
```
Now you can implement both projects using make and the Xilinx Platform Studio (XPS).

```
> cd $WD/recons/demos/sort_demo/build.sw
> make -j3 PREFIX=$WD/nfs/opt/reconos install
> cd $WD/reconos/demos/sort_demo/build.hw
> xps -nw system
xps> run bits
xps> exit
```
The bitstream generation will take a while, so it might be the right time to
get a coffee.

### Running the Demo

Now you have everything you need to run the SortDemo on real hardware. At
first, setup the SD card shipped with the board. The only thing you have to
do, is to cleanup the card and copy the right files to it.

```
> cp $WD/u-boot-xlnx/boot.bin /mnt/boot.bin
> cp $WD/u-boot-xlnx/u-boot.img /mnt/u-boot-dtb.img
> cp $WD/linux-xlnx/arch/boot/uImage /mnt/uImage
> cp $WD/linux-xlnx/arch/boot/dts/zynq-zed.dtb /mnt/devicetree.dtb
> cp $WD/reconos/demos/sort_demo/build.hw/implementation/system.bit /mnt/download.bit
> cat > /mnt/uEnv.txt <<'EOF'
sdboot=if mmcinfo; then run uenvboot; echo Copying Linux from SD to RAM... && load mmc 0 ${kernel_load_address} ${kernel_image} && load mmc 0 ${devicetree_load_address} ${devicetree_image} && bootm ${kernel_load_address} - ${devicetree_load_address}; fi

EOF
```

After that, insert the SD card into the Zedboard and configure the bootmode by
setting jumpers MI02, MI03 and MI06 to GND and MI04 and MI05 to 3V3. Turn on
the board, connect via UART and see how Linux boots. When a command prompt
appears, start the SortDemo and have fun.

```
zynq> cd /opt/reconos
zynq> ./reconos_init.sh
zynq> ./sortdemo
zynq> ./sortdemo 2 1 16
```
