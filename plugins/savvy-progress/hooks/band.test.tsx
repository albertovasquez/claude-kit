import { expect, mock, test } from 'claude-code/testing'

// A plugin beneath savvy-progress in the chain must still reach the band: the
// row is stacked over whatever came up, never answered in its place.
for (const surface of ['desktop', 'terminal'] as const) {
  test(`the band keeps the plugins beneath it on ${surface}`, async ($, on) => {
    mock.clock(on)
    on('ui.render', { component: 'AbovePrompt' }, ($, e) => {
      const { Text } = $.ui.resolve(e)
      return <Text>beneath-marker</Text>
    })
    const set = await $.tool.call({ tool: 'mcp__savvy-progress__progress', title: 'Flow under test', total: 2, done: 1, phase: 'delegate' })
    expect(set.deny).toBe(undefined)
    const band = await $.ui.mount({
      plugin: 'savvy-progress',
      surface,
      component: 'AbovePrompt',
      props: { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 100 } as never,
    })
    expect(JSON.stringify(await band.drawn())).toContain('beneath-marker')
    expect(await band.find({ key: 'savvy-dismiss' })).toBeDefined()
    await band.unmount()
  })
}
