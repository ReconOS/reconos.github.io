---
title: ReconOS API
layout: page
---
# ReconOS API
## Hardware Functions

### osif&#95;setup
#### Description
Assigns signals to the OSIF record. This function must be called
asynchronously in the main entity including the OS-FSM.

#### Parameters
| Name            | Type                                                | Description                                                                 |
|-----------------|-----------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `out i_osif_t`                                      | `i_osif_t` record                                                           |
| `o_osif`        | `in o_osif_t`                                       | `o_osif_t` record                                                           |
| `sw2hw_data`    | `in std_logic_vector(31 downto 0)`                  | data signal of OSIF from the processor (`OSIF_FIFO_Sw2Hw_Data`)             |
| `sw2hw_fill`    | `in std_logic_vector(15 downto 0)`                  | fill signal of OSIF from the processor (`OSIF_FIFO_Sw2Hw_Fill`)             |
| `sw2hw_empty`   | `in std_logic`                                      | empty signal of OSIF from the processor (`OSIF_FIFO_Sw2Hw_Empty`)           |
| `hw2sw_rem`     | `in std_logic_vector(15 downto 0)`                  | remaining signal of OSIF to the processor (`OSIF_FIFO_Hw2Sw_Rem`)           |
| `hw2sw_full`    | `in std_logic`                                      | full signal of OSIF to the processor (`OSIF_FIFO_Hw2Sw_Full`)               |
| `sw2hw_re`      | `out std_logic`                                     | read signal of OSIF from the processor (`OSIF_FIFO_Sw2Hw_RE`)               |
| `hw2sw_data`    | `out std_logic_vector(31 downto 0)`                 | data signal of OSIF to the processor (`OSIF_FIFO_Hw2Sw_Data`)               |
| `hw2sw_we`      | `out std_logic`                                     | write signal of OSIF to the processor (`OSIF_FIFO_Hw2Sw_WE`)                |


#### Example Usage
``` vhdl
architecture implementation of hwt is
	signal i_osif : i_osif_t;
	signal o_osif : o_osif_t;
begin

osif_setup (
	i_osif,
	o_osif,
	OSIF_FIFO_Sw2Hw_Data,
	OSIF_FIFO_Sw2Hw_Fill,
	OSIF_FIFO_Sw2Hw_Empty,
	OSIF_FIFO_Hw2Sw_Rem,
	OSIF_FIFO_Hw2Sw_Full,
	OSIF_FIFO_Sw2Hw_RE,
	OSIF_FIFO_Hw2Sw_Data,
	OSIF_FIFO_Hw2Sw_WE
);
```

- - -

### osif&#95;reset
#### Description
Resets the OSIF signals to a default state. This function should be called
on reset of the OS-FSM.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |

#### Example Usage
``` vhdl
if rst = '1' then
	osif_reset(o_osif);
end if;
```
- - -

### memif&#95;setup
#### Description
Assigns signals to the MEMIF record. This function must be called
asynchronously in the main entity including the OS-FSM.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_memif`       | `out i_memif_t`                                   | `i_memif_t` record                                                          |
| `o_memif`       | `in o_memif_t`                                    | `o_memif_t` record                                                          |
| `mem2hwt_data`  | `in std_logic_vector(31 downto 0)`                | data signal of MEMIF from the memory (`MEMIF_FIFO_Mem2Hwt_Data`)            |
| `mem2hwt_fill`  | `in std_logic_vector(15 downto 0)`                | fill signal of MEMIF from the memory (`MEMIF_FIFO_Mem2Hwt_Fill`)            |
| `mem2hwt_empty` | `in std_logic`                                    | empty signal of MEMIF from the memory (`MEMIF_FIFO_Mem2Hwt_Empty`)          |
| `hwt2mem_rem`   | `in std_logic_vector(15 downto 0)`                | remaining signal of MEMIF to the memory (`MEMIF_FIFO_Hwt2Mem_Rem`)          |
| `hwt2mem_full`  | `in std_logic`                                    | full signal of MEMIF to the memory (`MEMIF_FIFO_Hwt2Mem_Full`)              |
| `mem2hwt_re`    | `out std_logic`                                   | read signal of MEMIF from the memory (`MEMIF_FIFO_Mem2Hwt_RE`)              |
| `hwt2mem_data`  | `out std_logic_vector(31 downto 0)`               | data signal of MEMIF to the memory (`MEMIF_FIFO_Hwt2Mem_Data`)              |
| `hwt2mem_we`    | `out std_logic`                                   | write signal of MEMIF to the memory (`MEMIF_FIFO_Hwt2Mem_WE`)               |

#### Example Usage
``` vhdl
architecture implementation of hwt is
	signal i_memif : i_memif_t;
	signal o_memif : o_memif_t;
begin

memif_setup (
	i_memif,
	o_memif,
	MEMIF_FIFO_Mem2Hwt_Data,
	MEMIF_FIFO_Mem2Hwt_Fill,
	MEMIF_FIFO_Mem2Hwt_Empty,
	MEMIF_FIFO_Hwt2Mem_Rem,
	MEMIF_FIFO_Hwt2Mem_Full,
	MEMIF_FIFO_Mem2Hwt_RE,
	MEMIF_FIFO_Hwt2Mem_Data,
	MEMIF_FIFO_Hwt2Mem_WE
);
```

- - -

### memif&#95;reset
#### Description
Resets the MEMIF signals to a default state. This function should be called
on reset of the OS-FSM.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `o_memif`       | `out o_memif_t`                                   | `o_memif_t` record                                                          |

#### Example Usage
``` vhdl
if rst = '1' then
	memif_reset(o_memif);
end if;
```
- - -

### ram&#95;setup
#### Description
Assigns signals to the ram record. This function must be called
asynchronously in the main entity including the OS-FSM.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_ram`         | `out i_ram_t`                                     | `i_ram_t` record                                                            |
| `o_ram`         | `in o_ram_t`                                      | `o_ram_t` record                                                            |
| `addr`          | `out std_logic_vector(31 downto 0)`               | address signal of the local ram                                             |
| `we`            | `out std_logic`                                   | write enable signal of the local ram                                        |
| `o_data`        | `in std_logic_vector(31 downto 0)`                | output data signal of the local ram                                         |
| `i_data`        | `in std_logic_vector(31 downto 0)`                | input data signal of the local ram                                          |

#### Example Usage
``` vhdl
architecture implementation of hwt is
	signal i_ram : i_ram_t;
	signal o_ram : o_ram_t;

	-- definition of local ram
	type LOCAL_RAM_T is array (0 to C_LOCAL_RAM_SIZE - 1) of std_logic_vector(31 downto 0);
	shared variable local_ram : LOCAL_RAM_T;
	
	-- definition of ram signals
	signal ram_addr : std_logic_vector(C_LOCAL_RAM_ADDRESS_WIDTH - 1 downto 0);
	signal ram_addr_2 : std_logic_vector(31 downto 0);
	signal ram_we : std_logic;
	signal ram_o_data : std_logic_vector(0 to 31);
	signal ram_i_data : std_logic_vector(0 to 31);
begin

-- description of local ram
local_ram_ctrl : process (clk) is
begin
	if (rising_edge(clk)) then
		if (ram_we = '1') then
			local_ram(CONV_INTEGER(ram_addr)) := ram_i_data;
		else
			ram_o_data <= local_ram(CONV_INTEGER(ram_addr)));
		end if;
	end if;
end process;

-- RAM uses not 32 bit addresses
ram_addr <= ram_addr_2(C_LOCAL_RAM_ADDRESS_WIDTH - 1 downto 0);

ram_setup (
	i_ram,
	o_ram,
	ram_addr_2,
	ram_we,
	ram_i_data,
	ram_o_data
);
```

- - -

### ram&#95;reset
#### Description
Resets the RAM signals to a default state. This function should be called
on reset of the OS-FSM.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `o_ram`         | `out o_ram_t`                                     | `o_ram_t` record                                                            |

#### Example Usage
``` vhdl
if rst = '1' then
	ram_reset(o_ram);
end if;
```
- - -

### osif&#95;read
#### Description
Reads a single word from the OSIF.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `result`        | `out std_logic_vector(31 downto 0)`               | word read from the OSIF                                                     |
| `done`          | `out boolean`                                     | indicates when read finished                                                |

- - -

### osif&#95;write
#### Description
Writes a single word into the OSIF.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `data`          | `in std_logic_vector(31 downto 0)`                | word to write into the OSIF                                                 |
| `done`          | `out boolean`                                     | indicates when write finished                                               |

- - -

### osif&#95;set&#95;yield
#### Description
Yields the hardware thread slots. This causes the scheduler to be called
and might result in an preemption of the hardware thread. This method alone
does not issue any call but only sets the yield bit for a regular system call.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_set_yield(i_osif, o_osif);
	osif_mbox_put(i_osif, o_osif, MBOX_SEND, addr, ignore, done);
	
	if done then
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;sem&#95;post
#### Description
Posts the semaphore specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_sem_post(i_osif, o_osif, SEMAPHORE, ignore, done);
	
	if done then
		-- now the semaphore is released
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;sem&#95;wait
#### Description
Waits for the semaphore specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_sem_wait(i_osif, o_osif, SEMAPHORE, ignore, done);
	
	if done then
		-- now the semaphore is acquired
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;mutex&#95;lock
#### Description
Locks the mutex specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mutex_lock(i_osif, o_osif, MUTEX, ignore, done);
	
	if done then
		-- now the mutex is locked
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;mutex&#95;unlock
#### Description
Unlocks the mutex specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mutex_unlock(i_osif, o_osif, MUTEX, ignore, done);
	
	if done then
		-- now the mutex is unlocked
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;mutex&#95;trylock
#### Description
Tries to lock the mutex specified by handle and returns if successful or not.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | indicates whether mutex was locked or not                                   |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mutex_trylock(i_osif, o_osif, MUTEX, status, done);
	
	if done then
		if status = x"00000000" then
			-- mutex is locked
			state <= STATE_NEXT;
		else
			-- mutex is not locked
			state <= STATE_PREV;
		end if;
	end if;
```

- - -

### osif&#95;cond&#95;wait
#### Description
Waits for the condition variable specified by handle. You must
have locked the mutex before calling this function.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `cond_handle`   | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `mutex_handle`  | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_cond_wait(i_osif, o_osif, CONDITION, MUTEX, ignore, done);
	
	if done then
		-- condition reached
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;cond&#95;signal
#### Description
Signals a single thread waiting on the condition variable specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_cond_signal(i_osif, o_osif, CONDITION, ignore, done);
	
	if done then
		-- condition was signalled
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;cond&#95;broadcast
#### Description
Signals all threads waiting on the condition variable specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_sem_post(i_osif, o_osif, CONDITION, ignore, done);
	
	if done then
		-- condition was signalled
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;mbox&#95;put
#### Description
Puts a single word into the mbox specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `word`          | `in std_logic_vector(31 downto 0)`                | word to write into the mbox                                                 |
| `result`        | `out std_logic_vector(31 downto 0)`               | result of the osif call                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mbox_put(i_osif, o_osif, MBOX, data, ignore, done);
	
	if done then
		-- data is now written into the mbox
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;mbox&#95;get
#### Description
Reads a single word from the mbox specified by handle.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `result`        | `out std_logic_vector(31 downto 0)`               | word read from the mbox                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mbox_get(i_osif, o_osif, MBOX, data, done);
	
	if done then
		-- data is read out of the mbox
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;mbox&#95;tryput
#### Description
Tries to put a single word into the mbox specified by handle but does not
blocks until the mbox gets populated.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `word`          | `in std_logic_vector(31 downto 0)`                | word to write into the mbox                                                 |
| `result`        | `out std_logic_vector(31 downto 0)`               | indicates whether the word was written into the mbox                        |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mbox_tryput(i_osif, o_osif, MBOX, data, status, done);
	
	if done then
		if status = x"00000000" then
			-- data was not written into mbox
			state <= STATE_PREV;
		else
			-- data is now written into the mbox
			state <= STATE_NEXT;
		end if;
	end if;
```

- - -

### osif&#95;mbox&#95;tryget
#### Description
Tries to put a single word into the mbox specified by handle but does not
blocks until the mbox gets populated.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `handle`        | `in std_logic_vector(31 downto 0)`                | index representing the resource in the resource array                       |
| `word`          | `out std_logic_vector(31 downto 0)`               | word read from the mbox                                                     |
| `result`        | `out std_logic_vector(31 downto 0)`               | indicates whether word was read from the mbox                               |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_mbox_tryget(i_osif, o_osif, MBOX, data, status, done);
	
	if done then
		if status = x"00000000" then
			-- no data is read out of the mbox
			state <= STATE_PREV;
		else
			-- data is read out of mbox
			state <= STATE_NEXT;
		end if;
	end if;
```

- - -

### osif&#95;get&#95;init&#95;data
#### Description
Gets the pointer to the initialization data of the hardware thread
specified by reconos_hwt_setinitdata.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |
| `result`        | `out std_logic_vector(31 downto 0)`               | the pointer to the initialization data                                                     |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_gat_init_data(i_osif, o_osif, data, done);
	
	if done then
		-- init data is read
		state <= STATE_NEXT;
	end if;
```

- - -

### osif&#95;thread&#95;exit
#### Description
Terminates the current hardware thread and the delegate in software.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_osif`        | `in i_osif_t`                                     | `i_osif_t` record                                                           |
| `o_osif`        | `out o_osif_t`                                    | `o_osif_t` record                                                           |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	osif_thread_exit(i_osif, o_osif);
	
	state <= STATE_EXIT;
```

- - -

### memif&#95;flush
#### Description
Flushes the MEMIF-FIFOs to guarantee that no more words are
waiting to be written into the memory. Be aware, that this function only
checks the words in the MEMIF-FIFOs but does not guarantee that even the last
word was written into the memory.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_memif`       | `in i_memif_t`                                    | `i_memif_t` record                                                          |
| `o_memif`       | `out o_memif_t`                                   | `o_memif_t` record                                                          |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	memif_flush(i_memif, o_memif, done);
	
	if done then
		-- now the MEMIF-FIFO is empty
		state <= STATE_NEXT;
	end if;
```

- - -

### memif&#95;write&#95;word
#### Description
Writes a single word into the main memory. Be aware, that the address must
be word aligned

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_memif`       | `in i_memif_t`                                    | `i_memif_t` record                                                          |
| `o_memif`       | `out o_memif_t`                                   | `o_memif_t` record                                                          |
| `addr`          | `in std_logic_vector(31 downto 0)`                | address of the main memory to write                                         |
| `data`          | `in std_logic_vector(31 downto 0)`                | word to write into the main memory                                          |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	memif_write_word(i_memif, o_memif, x"00000000", data, done);
	
	if done then
		-- now data is written into the main memory at address 0
		state <= STATE_NEXT;
	end if;
```

- - -

### memif&#95;read&#95;word
#### Description
Reads a single word from the main memory. Be aware, that the address must
be word aligned

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_memif`       | `in i_memif_t`                                    | `i_memif_t` record                                                          |
| `o_memif`       | `out o_memif_t`                                   | `o_memif_t` record                                                          |
| `addr`          | `in std_logic_vector(31 downto 0)`                | address of the main memory to write                                         |
| `data`          | `out std_logic_vector(31 downto 0)`               | word read from the main memory                                              |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	memif_read_word(i_memif, o_memif, x"00000000", data, done);
	
	if done then
		-- now data contains the word from the main memory at address 0
		state <= STATE_NEXT;
	end if;
```

- - -

### memif&#95;write
#### Description
Writes several words from the local ram into the main memory. Be aware,
that the address must be word aligned and you can only write entire words.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_ram`         | `in i_ram_t`                                      | `i_ram_t` record                                                            |
| `o_ram`         | `out o_ram_t`                                     | `o_ram_t` record                                                            |
| `i_memif`       | `in i_memif_t`                                    | `i_memif_t` record                                                          |
| `o_memif`       | `out o_memif_t`                                   | `o_memif_t` record                                                          |
| `src_addr`      | `in std_logic_vector(31 downto 0)`                | start address to read from the local ram                                    |
| `dst_addr`      | `in std_logic_vector(31 downto 0)`                | start address to write into the main memory                                 |
| `len`           | `in std_logic_vector(24 downto 0)`                | number of bytes to write into the main memory                               |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	memif_write(i_ram, o_ram, i_memif, o_memif, x"00000000", x"c0000000", x"000004", done);
	
	if done then
		-- now 4 bytes are written from the local ram to the main memory
		state <= STATE_NEXT;
	end if;
```

- - -

### memif&#95;read
#### Description
Reads several words from the main memory into the local ram. Be aware,
that the address must be word aligned and you can only write entire words.

#### Parameters
| Name            | Type                                              | Description                                                                 |
|-----------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `i_ram`         | `in i_ram_t`                                      | `i_ram_t` record                                                            |
| `o_ram`         | `out o_ram_t`                                     | `o_ram_t` record                                                            |
| `i_memif`       | `in i_memif_t`                                    | `i_memif_t` record                                                          |
| `o_memif`       | `out o_memif_t`                                   | `o_memif_t` record                                                          |
| `src_addr`      | `in std_logic_vector(31 downto 0)`                | start address to read from the main memory                                  |
| `dst_addr`      | `in std_logic_vector(31 downto 0)`                | start address to write into the local ram                                   |
| `len`           | `in std_logic_vector(24 downto 0)`                | number of bytes to write into the main memory                               |
| `done`          | `out boolean`                                     | indicates when call finished                                                |

#### Example Usage
``` vhdl
when STATE_CURRENT =>
	memif_write(i_ram, o_ram, i_memif, o_memif, x"c0000000", x"00000000", x"000004", done);
	
	if done then
		-- now 4 bytes are read from main memory into the local ram
		state <= STATE_NEXT;
	end if;
```

- - -

## Software Functions

### reconos&#95;init
#### Description
Initializes the ReconOS environtmen and resets the hardware. You must
call this method before you can use any ReconOS function.

- - -

### reconos&#95;cleanup
#### Description
Cleans up the ReconOS environment and resets the hardware. You should
call this method before termination to prevent the hardware threads from
operating and avoid undesirable effects.
By default this method is registered as a signal handler for SIGINT,
SIGTERM and SIGABRT. Keep this in mind when overriding these handlers.

- - -

### reconos&#95;slot&#95;reset
#### Description
Resets a single hardware thread slot.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `slot`              | `int`                                             | slot number to reset                                                        |
| `reset`             | `int`                                             | set to 1 or 0 to set the reset signal accordingly                           |

- - -

### reconos&#95;set&#95;scheduler
#### Description
Specifies the scheduler for reconfigurable hardware threads. The
scheduler will be called when a hardware thread yields. Keep in mind
that the scheduler can be called concurrently multiple times and must
be synchronized.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `scheduler`         | `struct reconos_configuration* (*scheduler)(struct reconos_hwt *hwt)` | pointer to the scheduler                                  |

- - -

### reconos&#95;cache&#95;flush
#### Description
Flushes the cache of the processor. Consider that this method is not
needed on all architectures.

- - -

### reconos&#95;hwt&#95;setresources
#### Description
Associates a resource array to this hardware thread.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `hwt`               | `struct reconos_hwt *`                            | pointer to the configuration structure                                      |
| `resorce`           | `struct reconos_resource *`                       | pointer to the resource array to use                                        |
| `resource_count`    | `size_t`                                          | number of resources in the resource array                                   |

- - -

### reconos&#95;hwt&#95;setinitdata
#### Description
Associates initialization data to this hardware thread.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `hwt`               | `struct reconos_hwt *`                            | pointer to the configuration structure                                      |
| `init_data`         | `void *`                                          | pointer to the iniltialization data                                         |

- - -

### reconos&#95;hwt&#95;create
#### Description
Creates a new hardware thread running in the a specific slot. Before
executed the slot will be resetted.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `hwt`               | `struct reconos_hwt *`                            | pointer to the configuration structure                                      |
| `slot`              | `int`                                             | slot number to run the hardware thread in                                   |
| `arg`               | `void *`                                          | arguments for the delegate thread (passed to pthread_create)                |

- - -

### reconos&#95;hwt&#95;create_reconf
#### Description
Creates a new reconfigurable hardware thread running in the specific slot.
Before executed the slot is reconfigured with the appropriate bitstream
and resetted.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `hwt`               | `struct reconos_hwt *`                            | pointer to the configuration structure                                      |
| `slot`              | `int`                                             | slot number to run the hardware thread in (same as in cfg)                  |
| `cfg`               | `struct reconos_configuration *`                  | pointer to the configuration                                                |
| `arg`               | `void *`                                          | arguments for the delegate thread (passed to pthread_create)                |

- - -

### reconos&#95;configuration&#95;init
#### Description
Initializes a new configuration with default values. This function must
be called for every configuration you want to use.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `cfg`               | `struct reconos_configuration *`                  | pointer to the configuration structure                                      |
| `name`              | `char *`                                          | name to identify the configuration                                          |
| `slot`              | `int`                                             | the slot number you want to run the configuration in                        |

- - - 

### reconos&#95;configuration&#95;setresources
#### Description
Associates a resource array to this configuration. This is the equivalent
to reconos_set_resources for not reconfigurable hardware threads.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `cfg`               | `struct reconos_configuration *`                  | pointer to the configuration structure                                      |
| `resorce`           | `struct reconos_resource *`                       | pointer to the resource array to use                                        |
| `resource_count`    | `size_t`                                          | number of resources in the resource array                                   |

- - - 

### reconos&#95;configuration&#95;setbitstream
#### Description
Associates a bitstream to this configuration to program the FPGA
on reconfiguration.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `cfg`               | `struct reconos_configuration *`                  | pointer to the configuration structure                                      |
| `bitstream`         | `uint32_t *`                                      | pointer to the bitstream data                                               |
| `bitstream_length`  | `unsigned int`                                    | length of the bitstream in 32bit-words                                      |

- - - 

### reconos&#95;configuration&#95;loadbitstream
#### Description
Loads a bitstram from the filesystem and associates it to the configuration
by calling reconos_configuration_setbitstream.

#### Parameters
| Name                | Type                                              | Description                                                                 |
|---------------------|---------------------------------------------------|-----------------------------------------------------------------------------|
| `cfg`               | `struct reconos_configuration *`                  | pointer to the configuration structure                                      |
| `filename `         | `char *`                                          | filname of the bitstream-file                                               |


