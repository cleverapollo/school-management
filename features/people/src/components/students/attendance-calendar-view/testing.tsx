{
  sessionAttendanceData
    ?.filter((event) => event?.bellTime?.time && event?.bellTime?.name)
    .map((event) => (
      <TableRow key={event?.bellTimeId}>
        <TableCell>
          <Stack direction="row">
            <Typography variant="body2" color="#637381" fontWeight="600">
              {event?.bellTime?.time}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row">
            <Typography
              variant="body2"
              color="#212B36"
              fontWeight="600"
              fontSize="14px"
              sx={{ textWrap: 'noWrap' }}
            >
              {event?.bellTime?.name}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center">
            {event && event?.createdBy && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  fontSize: 14,
                }}
                name={displayName(event && event?.createdBy, {
                  format: PreferredNameFormat.FirstnameSurname,
                })}
                src={event?.createdBy && event?.createdBy?.avatarUrl}
              />
            )}
            <Typography
              variant="body2"
              color="#212B36"
              fontWeight="600"
              fontSize="14px"
              sx={{ textWrap: 'noWrap' }}
            >
              {displayName(event && event?.createdBy, {
                format: PreferredNameFormat.FirstnameSurname,
              })}
            </Typography>
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            flexGrow="1"
            padding={0}
            sx={{
              '& .MuiFormControl-root .MuiInputBase-input': {
                minWidth: { xs: '200px', md: 0 },
                paddingY: 1,
              },
            }}
          >
            <RHFTextField<EventAttendanceInputProps>
              key={event?.bellTimeId}
              textFieldProps={{
                fullWidth: true,
              }}
              controlProps={{
                name: `bellTime-${event?.bellTimeId}` as keyof EventAttendanceInputProps,
                control,
                defaultValue: (event?.note && event?.note) || '',
              }}
            />
          </Stack>
        </TableCell>
        <TableCell>
          <Stack
            direction="row"
            padding={0}
            sx={{ '& .MuiSelect-select': { paddingY: 1 } }}
          >
            <RHFSelect<EventAttendanceInputProps, AttendanceCodeInputProps>
              fullWidth
              options={attendanceCodes ?? []}
              getOptionLabel={(option) => option?.name}
              optionIdKey="id"
              controlProps={{
                name: `attendanceCode-${event?.bellTimeId}` as keyof EventAttendanceInputProps,
                control,
              }}
            />
          </Stack>
        </TableCell>
      </TableRow>
    ));
}
